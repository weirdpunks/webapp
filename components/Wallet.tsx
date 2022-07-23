import { claimAbi } from '@/artifacts/claim'
import { erc1155abi } from '@/artifacts/erc1155'
import { erc20abi } from '@/artifacts/erc20'
import { weirdPunksLayer2Abi } from '@/artifacts/weirdPunksLayer2'
import { weirdPunksMainnetAbi } from '@/artifacts/weirdPunksMainnet'
import { expansionsLayer2Abi } from '@/artifacts/expansionsLayer2'
import { expansionsMainnetAbi } from '@/artifacts/expansionsMainnet'
import {
  reset,
  setAddress,
  setBalances,
  setConnection,
  setENS,
  useApp
} from '@/components/Context'
import {
  openSea,
  weird,
  weirdClaim,
  weirdPunks,
  expansions
} from '@/utils/contracts'
import {
  ethereum as ethereumMapping,
  mumbai as mumbaiMapping,
  polygon as polygonMapping,
  rinkeby as rinkebyMapping
} from '@/utils/mappings'
import { providerOptions } from '@/utils/wallet'
import { useColorMode } from '@chakra-ui/react'
import axios from 'axios'
import { BigNumber, ethers } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import Web3Modal from 'web3modal'

const cacheProvider = true
const infuraId = process.env.NEXT_PUBLIC_INFURA_ID
const nftportApi = process.env.NEXT_PUBLIC_NFTPORT_API

const Wallet = () => {
  const { colorMode } = useColorMode()
  const { state, dispatch } = useApp()
  const { address, ens, isTestnet, instance, provider, isConnecting } = state

  const [web3Modal, setWeb3Modal] = useState<Web3Modal>()
  const [mainnetProvider, setMainnetProvider] =
    useState<ethers.providers.JsonRpcProvider>()
  const [layer2Provider, setLayer2Provider] =
    useState<ethers.providers.JsonRpcProvider>()
  const [goerliProvider, setGoerliProvider] =
    useState<ethers.providers.JsonRpcProvider>()

  useEffect(() => {
    const setProviders = () => {
      setMainnetProvider(
        new ethers.providers.JsonRpcProvider(
          `https://mainnet.infura.io/v3/${infuraId}`
        )
      )
      setLayer2Provider(
        new ethers.providers.JsonRpcProvider(
          `https://polygon-mainnet.infura.io/v3/${infuraId}`
        )
      )
    }

    const setTestnetProviders = () => {
      setLayer2Provider(
        new ethers.providers.JsonRpcProvider(
          `https://polygon-mumbai.infura.io/v3/${infuraId}`
        )
      )
      setMainnetProvider(
        new ethers.providers.JsonRpcProvider(
          `https://rinkeby.infura.io/v3/${infuraId}`
        )
      )
      setGoerliProvider(
        new ethers.providers.JsonRpcProvider(
          `https://goerli.infura.io/v3/${infuraId}`
        )
      )
    }

    if (address !== '') {
      if (isTestnet) {
        setTestnetProviders()
      } else {
        setProviders()
      }
    }
  }, [address, isTestnet])

  useEffect(() => {
    const checkENS = async () => {
      const ensName = await mainnetProvider?.lookupAddress(address)
      if (ensName && ensName !== '') {
        dispatch(setENS(ensName))
      }
    }
    if (!isTestnet && mainnetProvider && address !== '' && ens === '') {
      checkENS()
    }
  }, [isTestnet, address, ens, mainnetProvider, dispatch])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const options = {
        cacheProvider: true,
        theme: colorMode === 'dark' ? 'dark' : 'light',
        providerOptions
      }
      const modal = new Web3Modal(options)
      setWeb3Modal(modal)
    }
  }, [colorMode])

  const connect = useCallback(async () => {
    const instance = await web3Modal?.connect()
    const provider = new ethers.providers.Web3Provider(instance)
    const signer = provider.getSigner()
    const address = await signer.getAddress()
    const network = await provider.getNetwork()
    const isTestnet = Boolean(network.chainId !== 1 && network.chainId !== 137)
    const isLayer2 = Boolean(
      network.chainId === 137 || network.chainId === 80001
    )
    dispatch(
      setConnection({
        instance,
        provider,
        signer,
        chainId: network.chainId,
        isTestnet,
        isLayer2,
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
      provider: ethers.providers.JsonRpcProvider | undefined
    }) => {
      try {
        const erc20 = new ethers.Contract(contract, erc20abi, provider)
        const balance = await erc20.balanceOf(`${address}`)
        if (balance) {
          return Math.floor(parseFloat(ethers.utils.formatUnits(balance, 18)))
        }
      } catch (e) {
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
      provider: ethers.providers.JsonRpcProvider | undefined
      mapping: {
        id: number
        osid: string
      }[]
    }) => {
      try {
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
      } catch (e) {
        return []
      }
    },
    [address]
  )

  const getIdsNFTPort = useCallback(
    async ({ contract, chain }: { contract: string; chain: string }) => {
      try {
        interface NFT {
          token_id: string
        }

        interface NFTPORT {
          response: string
          nfts: NFT[]
        }
        const url = `https://api.nftport.xyz/v0/accounts/${address}`
        const res = await axios.get<NFTPORT>(url, {
          params: {
            chain,
            contract_address: contract
          },
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${nftportApi}`
          }
        })
        if (res.data.response === 'OK' && res.data.nfts.length > 0) {
          const ids = res.data.nfts.map((i: { token_id: string }) =>
            parseInt(i.token_id)
          )
          return ids.sort((a, b) => a - b)
        }
      } catch (e) {
        return []
      }
    },
    [address]
  )

  const getLayer2WeirdPunks = useCallback(
    async ({
      contract,
      provider
    }: {
      contract: string
      provider: ethers.providers.JsonRpcProvider | undefined
    }) => {
      try {
        const wp = new ethers.Contract(contract, weirdPunksLayer2Abi, provider)
        const res: BigNumber[] = await wp.walletOfOwner(`${address}`)
        const unsorted: number[] = res.map((i) => i.toNumber())
        const sorted = unsorted.sort((a, b) => a - b)
        return sorted
      } catch (e) {
        return []
      }
    },
    [address]
  )

  const getLayer2Expansions = useCallback(
    async ({
      contract,
      provider
    }: {
      contract: string
      provider: ethers.providers.JsonRpcProvider | undefined
    }) => {
      try {
        const ewp = new ethers.Contract(contract, expansionsLayer2Abi, provider)
        const res: BigNumber[] = await ewp.walletOfOwner(`${address}`)
        const unsorted: number[] = res.map((i) => i.toNumber())
        const sorted = unsorted.sort((a, b) => a - b)
        return sorted
      } catch (e) {
        return []
      }
    },
    [address]
  )

  const getUnclaimedBalance = useCallback(
    async ({
      contract,
      provider,
      ids
    }: {
      contract: string
      provider: ethers.providers.JsonRpcProvider | undefined
      ids: number[] | undefined
    }) => {
      try {
        let layer2Total = 0
        let mainnetTotal = 0
        const claim = new ethers.Contract(contract, claimAbi, provider)
        const l2 = await claim.claimableForWallet(`${address}`)
        if (l2) {
          layer2Total = Math.floor(parseFloat(ethers.utils.formatUnits(l2, 18)))
        }
        if (ids) {
          const mainnet = await claim.claimableForIDs(ids)
          if (mainnet) {
            mainnetTotal = Math.floor(
              parseFloat(ethers.utils.formatUnits(mainnet, 18))
            )
          }
        }
        const unclaimed = layer2Total + mainnetTotal
        return unclaimed
      } catch (_e) {
        return 0
      }
    },
    [address]
  )

  useEffect(() => {
    const getBalances = async () => {
      const mainnetBalance = await getERC20Balance({
        contract: isTestnet ? weird.goerli : weird.mainnet,
        provider: isTestnet ? goerliProvider : mainnetProvider
      })
      const layer2Balance = await getERC20Balance({
        contract: isTestnet ? weird.mumbai : weird.polygon,
        provider: layer2Provider
      })
      const mainnetOSWeirdPunks = await getERC1155BalanceOfBatch({
        contract: isTestnet ? openSea.rinkeby : openSea.mainnet,
        provider: mainnetProvider,
        mapping: isTestnet ? rinkebyMapping : ethereumMapping
      })
      const layer2OSWeirdPunks = await getERC1155BalanceOfBatch({
        contract: isTestnet ? openSea.mumbai : openSea.polygon,
        provider: layer2Provider,
        mapping: isTestnet ? mumbaiMapping : polygonMapping
      })
      const mainnetWeirdPunks = await getIdsNFTPort({
        chain: isTestnet ? 'rinkeby' : 'ethereum',
        contract: isTestnet ? weirdPunks.rinkeby : weirdPunks.mainnet
      })
      const layer2WeirdPunks = await getLayer2WeirdPunks({
        contract: isTestnet ? weirdPunks.mumbai : weirdPunks.polygon,
        provider: layer2Provider
      })
      const mainnetExpansions = await getIdsNFTPort({
        chain: 'ethereum',
        contract: expansions.mainnet
      })
      const layer2Expansions = await getIdsNFTPort({
        chain: 'polygon',
        contract: expansions.polygon
      })
      const unclaimed = await getUnclaimedBalance({
        contract: isTestnet ? weirdClaim.mumbai : weirdClaim.polygon,
        provider: layer2Provider,
        ids: mainnetWeirdPunks
      })

      const balances = {
        weirdMainnet: mainnetBalance || 0,
        weirdLayer2: layer2Balance || 0,
        unclaimed: unclaimed,
        weirdPunksMainnet: mainnetWeirdPunks || [],
        weirdPunksLayer2: layer2WeirdPunks || [],
        expansionsMainnet: mainnetExpansions || [],
        expansionsLayer2: layer2Expansions || [],
        osMainnet: mainnetOSWeirdPunks || [],
        osLayer2: layer2OSWeirdPunks || []
      }
      const data = { timestamp: Math.floor(Date.now() / 1000), balances }
      console.log(data)
      localStorage.setItem('balances', JSON.stringify(data))

      dispatch(setBalances(balances))
    }

    if (
      (address !== '' &&
        isTestnet &&
        mainnetProvider &&
        layer2Provider &&
        goerliProvider) ||
      (!isTestnet && mainnetProvider && layer2Provider)
    ) {
      const JSONdata = localStorage.getItem('balances')
      if (JSONdata) {
        const data = JSON.parse(JSONdata)
        if (data.timestamp + 300 < Math.floor(Date.now() / 1000)) {
          getBalances()
        } else {
          dispatch(setBalances(data.balances))
        }
      } else {
        getBalances()
      }
    }
  }, [
    isTestnet,
    address,
    provider,
    dispatch,
    mainnetProvider,
    layer2Provider,
    goerliProvider,
    getERC20Balance,
    getERC1155BalanceOfBatch,
    getLayer2WeirdPunks,
    getIdsNFTPort,
    getLayer2Expansions,
    getUnclaimedBalance
  ])

  return null
}

export default Wallet
