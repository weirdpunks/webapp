import Address from './Address'
import {
  useApp,
  Chain,
  setSigner,
  setAddress,
  setChain,
  setIds,
  setBalance,
  reset
} from './Context/Index'
import { chains, ChainData } from '../utils/chains'
import { weird } from '../utils/contracts'
import { ethers } from 'ethers'
import WalletConnectProvider from '@walletconnect/web3-provider'
import WalletLink from 'walletlink'
import Web3Modal from 'web3modal'
import {
  Box,
  Button,
  Link,
  Icon,
  useColorMode,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react'
import { FaWallet } from 'react-icons/fa'
import { useCallback, useEffect, useState } from 'react'
import { erc20abi } from '../artifacts/erc20'

const cacheProvider = true
const infuraId = process.env.NEXT_PUBLIC_INFURA_ID

const Web3 = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { colorMode } = useColorMode()
  const { state, dispatch } = useApp()
  const { signer, chain, address, testnet } = state

  const [currChain, setCurrChain] = useState<ChainData | null>(null)
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
      dispatch(setChain(found.id))
    }
    setProvider(walletProvider)
  }, [dispatch, colorMode])

  useEffect(() => {
    const checkCache = async () => {
      await connect()
    }
    if (!address && cacheProvider) {
      if (localStorage.getItem('WEB3_CONNECT_CACHED_PROVIDER')) {
        checkCache()
      }
    }
  }, [address, connect])

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
          dispatch(setChain(found.id))
        }
      })
    }
    if (provider) {
      subscribe()
    }
  }, [provider, dispatch])

  useEffect(() => {
    const getBalance = async ({
      url,
      contract
    }: {
      url: string
      contract: string
    }) => {
      const provider = new ethers.providers.JsonRpcProvider(url)
      const erc20 = new ethers.Contract(contract, erc20abi, provider)
      const balance = await erc20.balanceOf(`${address}`)
      if (balance) {
        return Math.floor(parseFloat(ethers.utils.formatUnits(balance, 18)))
      } else {
        return 0
      }
    }

    const loadAssets = async () => {
      const mainnet = testnet
        ? {
            url: `https://goerli.infura.io/v3/${infuraId}`,
            contract: weird.goerli
          }
        : {
            url: `https://mainnet.infura.io/v3/${infuraId}`,
            contract: weird.mainnet
          }
      const layer2 = testnet
        ? {
            url: `https://polygon-mumbai.infura.io/v3/${infuraId}`,
            contract: weird.mumbai
          }
        : {
            url: `https://polygon-mainnet.infura.io/v3/${infuraId}`,
            contract: weird.polygon
          }
      const weirdMainnet = await getBalance(mainnet)
      const weirdLayer2 = await getBalance(layer2)
      dispatch(setBalance({ balance: weirdMainnet, isLayer2: false }))
      dispatch(setBalance({ balance: weirdLayer2, isLayer2: true }))
    }

    if (address !== '') {
      loadAssets()
    }
  }, [testnet, address, dispatch])

  useEffect(() => {
    const setChainData = async () => {
      const found = await chains.find((i) => i.id === chain)
      if (found) {
        setCurrChain(found)
      }
    }
    if (chain) {
      setChainData()
    }
  }, [chain])

  const handleWalletClick = () => {
    const openConnection = async () => {
      await connect()
    }
    openConnection()
  }

  return (
    <>
      {address ? (
        <>
          <Button onClick={onOpen}>
            <Address address={address} avatar='right' size={4} />
          </Button>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Account</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Address address={address} avatar='left' size={8} copyable />
                <Box mt={10} px={10}>
                  <Link
                    href={`${currChain?.explorer}/address/${address}`}
                    isExternal>
                    View on Explorer
                  </Link>
                </Box>
              </ModalBody>
              <ModalFooter>
                <Button
                  colorScheme='red'
                  mr={3}
                  onClick={async () => {
                    dispatch(reset())
                    window.localStorage.removeItem(
                      'WEB3_CONNECT_CACHED_PROVIDER'
                    )
                    onClose()
                  }}>
                  Disconnect
                </Button>
                <Button variant='ghost' onClick={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      ) : (
        <Button onClick={handleWalletClick}>
          <Icon as={FaWallet} />
        </Button>
      )}
    </>
  )
}

export default Web3
