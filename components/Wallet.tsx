import {
  useApp,
  setConnection,
  setAddress,
  setENS,
  setBalances,
  reset
} from '@/components/Context'
import { weird, openSea } from '@/utils/contracts'
import { providerOptions } from '@/utils/wallet'
import { mumbai, rinkeby, polygon, ethereum } from '@/utils/mappings'
import { ethers } from 'ethers'
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
  const { address, ens, isTestnet, instance, provider, isConnecting } = state

  const [web3Modal, setWeb3Modal] = useState<Web3Modal>()
  const [mainnetProvider, setMainnetProvider] =
    useState<ethers.providers.JsonRpcProvider>()
  const [layer2Provider, setLayer2Provider] =
    useState<ethers.providers.JsonRpcProvider>()

  useEffect(() => {
    const setProviders = () => {
      const mainnetRPC = isTestnet
        ? 'https://goerli.infura.io/v3/'
        : 'https://mainnet.infura.io/v3/'
      const layer2RPC = isTestnet
        ? 'https://polygon-mumbai.infura.io/v3/'
        : 'https://polygon-mainnet.infura.io/v3/'
      const mainnet = new ethers.providers.JsonRpcProvider(
        `${mainnetRPC}${infuraId}`
      )
      const layer2 = new ethers.providers.JsonRpcProvider(
        `${layer2RPC}${infuraId}`
      )
      setMainnetProvider(mainnet)
      setLayer2Provider(layer2)
    }
    if (address !== '') {
      setProviders()
    }
  }, [address, isTestnet])

  useEffect(() => {
    const checkENS = async () => {
      const ensName = await mainnetProvider?.lookupAddress(address)
      if (ensName && ensName !== '') {
        dispatch(setENS(ensName))
      }
    }
    if (mainnetProvider && address !== '' && ens === '') {
      checkENS()
    }
  }, [address, ens, mainnetProvider, dispatch])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const modal = new Web3Modal({
        cacheProvider: true,
        theme: colorMode === 'dark' ? 'dark' : 'light',
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
    const network = await provider.getNetwork()
    const testnet = Boolean(network.chainId !== 1 && network.chainId !== 137)
    dispatch(
      setConnection({
        instance,
        provider,
        signer,
        chainId: network.chainId,
        isTestnet: testnet,
        address
      })
    )
  }, [dispatch, web3Modal])

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

  useEffect(() => {
    if (instance) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length) {
          dispatch(setAddress(accounts[0]))
        }
      }
      const handleChainChanged = (_hexChainId: string) => {
        window.location.reload()
      }

      const handleConnect = (info: { chainId: number }) => {
        console.log(info)
      }

      const handleDisconnect = (_error: { code: number; message: string }) => {
        dispatch(reset())
        window.localStorage.removeItem('WEB3_CONNECT_CACHED_PROVIDER')
      }

      instance.on('accountsChanged', handleAccountsChanged)
      instance.on('chainChanged', handleChainChanged)
      instance.on('connect', handleConnect)
      instance.on('disconnect', handleDisconnect)
      return () => {
        if (instance.removeListener) {
          instance.removeListener('accountsChanged', handleAccountsChanged)
          instance.removeListener('chainChanged', handleChainChanged)
          instance.removeListener('connect', handleConnect)
          instance.removeListener('disconnect', handleDisconnect)
        }
      }
    }
  }, [instance, dispatch])

  const getERC20Balance = useCallback(
    async ({
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
    },
    [address]
  )

  const getERC1155BalanceOfBatch = useCallback(
    async ({
      contract,
      provider,
      mapping
    }: {
      contract: string
      provider: ethers.providers.JsonRpcProvider
      mapping: {
        id: number
        osid: string
      }[]
    }) => {
      let addresses = []
      let ids = []
      for (let i = 0; i < mapping.length; i++) {
        addresses.push(address)
        ids.push(mapping[i].osid)
      }
      const erc1155 = new ethers.Contract(contract, erc1155abi, provider)
      const balance = await erc1155.balanceOfBatch(addresses, ids)
      let found = []
      for (let i = 0; i < balance.length; i++) {
        if (balance[i].toString() === '1') {
          found.push(mapping[i].id)
        }
      }
      return found
    },
    [address]
  )

  useEffect(() => {
    const getBalances = async () => {
      if (mainnetProvider && layer2Provider) {
        const mainnetContract = isTestnet ? weird.goerli : weird.mainnet
        const layer2Contract = isTestnet ? weird.mumbai : weird.polygon
        const mainnetOSContract = isTestnet ? openSea.rinkeby : openSea.mainnet
        const layer2OSContract = isTestnet ? openSea.mumbai : openSea.polygon
        const mainnetMapping = isTestnet ? rinkeby : ethereum
        const layer2Mapping = isTestnet ? mumbai : polygon
        const mainnetBalance = await getERC20Balance({
          contract: isTestnet ? '' : mainnetContract,
          provider: mainnetProvider
        })
        const layer2Balance = await getERC20Balance({
          contract: layer2Contract,
          provider: layer2Provider
        })
        const mainnetOSWeirdPunks = await getERC1155BalanceOfBatch({
          contract: mainnetOSContract,
          provider: mainnetProvider,
          mapping: mainnetMapping
        })
        const layer2OSWeirdPunks = await getERC1155BalanceOfBatch({
          contract: layer2OSContract,
          provider: layer2Provider,
          mapping: layer2Mapping
        })
        dispatch(
          setBalances({
            weirdMainnet: mainnetBalance,
            weirdLayer2: layer2Balance,
            osMainnet: mainnetOSWeirdPunks,
            osLayer2: layer2OSWeirdPunks
          })
        )
      }
    }

    if (address !== '' && mainnetProvider && layer2Provider) {
      getBalances()
    }
  }, [
    isTestnet,
    address,
    dispatch,
    mainnetProvider,
    layer2Provider,
    getERC20Balance,
    getERC1155BalanceOfBatch
  ])

  return null
}

export default Wallet
