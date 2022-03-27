import {
  useApp,
  setConnection,
  setChain,
  setIds,
  setBalance,
  reset
} from '@/components/Context'
import { chains } from '@/utils/chains'
import { weird, openSea } from '@/utils/contracts'
import { providerOptions } from '@/utils/wallet'
import { mumbai, rinkeby, polygon, ethereum } from '@/utils/mappings'
import { ethers } from 'ethers'
import WalletConnectProvider from '@walletconnect/web3-provider'
import WalletLink from 'walletlink'
import Web3Modal from 'web3modal'
import { useColorMode } from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'
import { erc20abi } from '@/artifacts/erc20'
import { erc1155abi } from '@/artifacts/erc1155'

const cacheProvider = true
const infuraId = process.env.NEXT_PUBLIC_INFURA_ID

const Wallet = () => {
  const { colorMode } = useColorMode()
  const { state, dispatch } = useApp()
  const { address, isTestnet, provider, signer, isConnecting } = state

  const [web3Modal, setWeb3Modal] = useState<Web3Modal>()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const modal = new Web3Modal({
        cacheProvider: true,
        theme: colorMode === 'dark' ? 'dark' : 'light',
        network: 'mainnet',
        providerOptions
      })

      setWeb3Modal(modal)
    }
  }, [colorMode])

  const connect = useCallback(async () => {
    const instance = await web3Modal?.connect()
    const provider = new ethers.providers.Web3Provider(instance)
    const signer = provider.getSigner()
    const address = await signer.getAddress()
    const ens = await provider.lookupAddress(address)
    const network = await provider.getNetwork()
    const testnet = Boolean(network.chainId !== 1 && network.chainId !== 137)
    dispatch(
      setConnection({
        instance,
        provider,
        signer,
        chainId: network.chainId,
        isTestnet: testnet,
        address,
        ens: ens ? ens : ''
      })
    )
    // console.log(`${address.toString()} ${JSON.stringify(network)} ${ens}`)
  }, [dispatch, web3Modal])

  // const disconnect = useCallback(async () => {
  //   await web3Modal?.clearCachedProvider()
  //   if (provider?.disconnect && typeof provider.disconnect === 'function') {
  //     await provider.disconnect()
  //   }
  // }, [provider])

  useEffect(() => {
    const load = async () => {
      await connect()
    }
    if (web3Modal) {
      if (isConnecting) {
        load()
      } else if (address === '' && cacheProvider) {
        if (localStorage.getItem('WEB3_CONNECT_CACHED_PROVIDER')) {
          load()
        }
      }
    }
  }, [web3Modal, address, isConnecting, connect])

  // useEffect(() => {
  //   if (provider?.on) {
  //     // const handleAccountsChanged = (accounts: string[]) => {
  //     //   // eslint-disable-next-line no-console
  //     //   console.log('accountsChanged', accounts)
  //     // }
  //     // const handleChainChanged = (_hexChainId: string) => {
  //     //   window.location.reload()
  //     // }

  //     // const handleDisconnect = (error: { code: number; message: string }) => {
  //     //   // eslint-disable-next-line no-console
  //     //   console.log('disconnect', error)
  //     //   // disconnect()
  //     // }

  //     // provider.on('accountsChanged', handleAccountsChanged)
  //     // provider.on('chainChanged', handleChainChanged)
  //     // provider.on('disconnect', handleDisconnect)
  //     provider.on('accountsChanged', (accounts: string[]) =>
  //       console.log(accounts.toString())
  //     )
  //     provider.on('chainChanged', () => console.log('chain changed'))
  //     provider.on('disconnect', () => console.log('disconnect'))
  //     console.log('provider active')

  //     return () => {
  //       // if (provider.removeListener) {
  //       //   provider.removeListener('accountsChanged', handleAccountsChanged)
  //       //   provider.removeListener('chainChanged', handleChainChanged)
  //       //   provider.removeListener('disconnect', handleDisconnect)
  //       // }
  //     }
  //   }
  // }, [provider])

  //   useEffect(() => {
  //     const getBalance = async ({
  //       contract,
  //       provider
  //     }: {
  //       contract: string
  //       provider: ethers.providers.JsonRpcProvider
  //     }) => {
  //       const erc20 = new ethers.Contract(contract, erc20abi, provider)
  //       const balance = await erc20.balanceOf(`${address}`)
  //       if (balance) {
  //         return Math.floor(parseFloat(ethers.utils.formatUnits(balance, 18)))
  //       } else {
  //         return 0
  //       }
  //     }

  //     interface Map {
  //       id: number
  //       osid: string
  //     }

  //     const getOpenSeaIds = async ({
  //       mapping,
  //       os,
  //       isLayer2,
  //       provider
  //     }: {
  //       mapping: Map[]
  //       os: string
  //       isLayer2: boolean
  //       provider: ethers.providers.JsonRpcProvider
  //     }) => {
  //       let addresses = []
  //       let ids = []
  //       for (let i = 0; i < mapping.length; i++) {
  //         addresses.push(address)
  //         ids.push(mapping[i].osid)
  //       }
  //       const erc1155 = new ethers.Contract(os, erc1155abi, provider)
  //       const balance = await erc1155.balanceOfBatch(addresses, ids)
  //       let found = []
  //       for (let i = 0; i < balance.length; i++) {
  //         if (balance[i].toString() === '1') {
  //           found.push(mapping[i].id)
  //         }
  //       }
  //       if (found.length > 0) {
  //         dispatch(setIds({ ids: found, isLayer2, isOpenSea: true }))
  //       }
  //     }

  //     const loadAssets = async () => {
  //       const mainnet = isTestnet
  //         ? {
  //             url: `https://goerli.infura.io/v3/${infuraId}`,
  //             contract: weird.goerli,
  //             os: openSea.rinkeby,
  //             mapping: rinkeby
  //           }
  //         : {
  //             url: `https://mainnet.infura.io/v3/${infuraId}`,
  //             contract: weird.mainnet,
  //             os: openSea.mainnet,
  //             mapping: ethereum
  //           }
  //       const layer2 = isTestnet
  //         ? {
  //             url: `https://polygon-mumbai.infura.io/v3/${infuraId}`,
  //             contract: weird.mumbai,
  //             os: openSea.mumbai,
  //             mapping: mumbai
  //           }
  //         : {
  //             url: `https://polygon-mainnet.infura.io/v3/${infuraId}`,
  //             contract: weird.polygon,
  //             os: openSea.polygon,
  //             mapping: polygon
  //           }
  //       const mainnetProvider = new ethers.providers.JsonRpcProvider(mainnet.url)
  //       const layer2Provider = new ethers.providers.JsonRpcProvider(layer2.url)
  //       const weirdMainnet = await getBalance({
  //         contract: mainnet.contract,
  //         provider: mainnetProvider
  //       })
  //       if (weirdMainnet > 0) {
  //         dispatch(setBalance({ balance: weirdMainnet, isLayer2: false }))
  //       }
  //       const weirdLayer2 = await getBalance({
  //         contract: layer2.contract,
  //         provider: layer2Provider
  //       })
  //       if (weirdLayer2 > 0) {
  //         dispatch(setBalance({ balance: weirdLayer2, isLayer2: true }))
  //       }
  //       await getOpenSeaIds({
  //         mapping: mainnet.mapping,
  //         os: mainnet.os,
  //         isLayer2: false,
  //         provider: mainnetProvider
  //       })
  //       await getOpenSeaIds({
  //         mapping: layer2.mapping,
  //         os: layer2.os,
  //         isLayer2: true,
  //         provider: layer2Provider
  //       })
  //     }

  //     if (address !== '') {
  //       loadAssets()
  //     }
  //   }, [isTestnet, address, dispatch])

  return <div></div>
}

export default Wallet
