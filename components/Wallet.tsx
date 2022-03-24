import Address from '@/components/UI/Address'
import {
  useApp,
  Chain,
  setSigner,
  setAddress,
  setChain,
  setIds,
  setBalance,
  reset
} from '@/components/Context'
import { chains, ChainData } from '@/utils/chains'
import { weird, openSea } from '@/utils/contracts'
import { mumbai, rinkeby, polygon, ethereum } from '@/utils/mappings'
import { ethers } from 'ethers'
import WalletConnectProvider from '@walletconnect/web3-provider'
import WalletLink from 'walletlink'
import Web3Modal from 'web3modal'
import { useColorMode, useDisclosure } from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'
import { erc20abi } from '../artifacts/erc20'
import { erc1155abi } from '../artifacts/erc1155'

const cacheProvider = true
const infuraId = process.env.NEXT_PUBLIC_INFURA_ID

const Wallet = () => {
  const { colorMode } = useColorMode()
  const { state, dispatch } = useApp()
  const { address, testnet, loading } = state
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null)

  const connect = useCallback(async () => {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId
        }
      },
      walletlink: {
        package: WalletLink,
        options: {
          appName: 'Weird Punks',
          infuraId
        }
      }
    }
    const web3Modal = new Web3Modal({
      // network: chain === Chain.unknown ? Chain.polygon : chain,
      cacheProvider,
      theme: colorMode === 'dark' ? 'dark' : 'light',
      providerOptions
    })
    const instance = await web3Modal.connect()
    const walletProvider = new ethers.providers.Web3Provider(instance)
    const newSigner = walletProvider.getSigner()
    const accounts = await walletProvider.listAccounts()
    const { chainId } = await walletProvider.getNetwork()
    const found = chains.find((i) => i.key === `0x${chainId.toString(16)}`)
    dispatch(setSigner(newSigner))
    dispatch(setAddress(accounts[0]))
    if (found) {
      dispatch(setChain({ chain: found.id, isTestnet: Boolean(found.testnet) }))
    }
    setProvider(walletProvider)
  }, [dispatch, colorMode])

  useEffect(() => {
    const checkCache = async () => {
      await connect()
    }
    if (loading && cacheProvider) {
      if (localStorage.getItem('WEB3_CONNECT_CACHED_PROVIDER')) {
        checkCache()
      }
    }
  }, [loading, connect])

  useEffect(() => {
    const subscribe = async () => {
      if (!provider?.on) {
        return
      }

      provider.on('disconnect', (error: { code: number; message: string }) => {
        dispatch(reset())
        console.log(error)
      })
      provider.on('accountsChanged', async (accounts: string[]) => {
        dispatch(setAddress(accounts[0]))
      })
      provider.on('chainChanged', (chainId: number) => {
        const chainKey = `0x${chainId.toString(16)}`
        const found = chains.find((i) => i.key === chainKey)
        if (found) {
          dispatch(
            setChain({ chain: found.id, isTestnet: Boolean(found.testnet) })
          )
        }
      })
    }
    if (provider) {
      subscribe()
    }
  }, [provider, dispatch])

  useEffect(() => {
    const getBalance = async ({
      contract,
      provider
    }: {
      contract: string
      provider: ethers.providers.JsonRpcProvider
    }) => {
      const erc20 = new ethers.Contract(contract, erc20abi, provider)
      const balance = await erc20.balanceOf(`${address}`)
      if (balance) {
        return Math.floor(parseFloat(ethers.utils.formatUnits(balance, 18)))
      } else {
        return 0
      }
    }

    interface Map {
      id: number
      osid: string
    }

    const getOpenSeaIds = async ({
      mapping,
      os,
      isLayer2,
      provider
    }: {
      mapping: Map[]
      os: string
      isLayer2: boolean
      provider: ethers.providers.JsonRpcProvider
    }) => {
      let addresses = []
      let ids = []
      for (let i = 0; i < mapping.length; i++) {
        addresses.push(address)
        ids.push(mapping[i].osid)
      }
      const erc1155 = new ethers.Contract(os, erc1155abi, provider)
      const balance = await erc1155.balanceOfBatch(addresses, ids)
      let found = []
      for (let i = 0; i < balance.length; i++) {
        if (balance[i].toString() === '1') {
          found.push(mapping[i].id)
        }
      }
      if (found.length > 0) {
        dispatch(setIds({ ids: found, isLayer2, isOpenSea: true }))
      }
    }

    const loadAssets = async () => {
      const mainnet = testnet
        ? {
            url: `https://goerli.infura.io/v3/${infuraId}`,
            contract: weird.goerli,
            os: openSea.rinkeby,
            mapping: rinkeby
          }
        : {
            url: `https://mainnet.infura.io/v3/${infuraId}`,
            contract: weird.mainnet,
            os: openSea.mainnet,
            mapping: ethereum
          }
      const layer2 = testnet
        ? {
            url: `https://polygon-mumbai.infura.io/v3/${infuraId}`,
            contract: weird.mumbai,
            os: openSea.mumbai,
            mapping: mumbai
          }
        : {
            url: `https://polygon-mainnet.infura.io/v3/${infuraId}`,
            contract: weird.polygon,
            os: openSea.polygon,
            mapping: polygon
          }
      const mainnetProvider = new ethers.providers.JsonRpcProvider(mainnet.url)
      const layer2Provider = new ethers.providers.JsonRpcProvider(layer2.url)
      const weirdMainnet = await getBalance({
        contract: mainnet.contract,
        provider: mainnetProvider
      })
      if (weirdMainnet > 0) {
        dispatch(setBalance({ balance: weirdMainnet, isLayer2: false }))
      }
      const weirdLayer2 = await getBalance({
        contract: layer2.contract,
        provider: layer2Provider
      })
      if (weirdLayer2 > 0) {
        dispatch(setBalance({ balance: weirdLayer2, isLayer2: true }))
      }
      await getOpenSeaIds({
        mapping: mainnet.mapping,
        os: mainnet.os,
        isLayer2: false,
        provider: mainnetProvider
      })
      await getOpenSeaIds({
        mapping: layer2.mapping,
        os: layer2.os,
        isLayer2: true,
        provider: layer2Provider
      })
    }

    if (address !== '') {
      loadAssets()
    }
  }, [testnet, address, dispatch])

  return null
}

export default Wallet
