import Address from './Address'
import {
  useApp,
  Chain,
  setInstance,
  setProvider,
  setSigner,
  setAddress,
  setChain,
  reset
} from './Context/Index'
import { chains, ChainData } from '../utils/chains'
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

const cacheProvider = true
const infuraId = process.env.NEXT_PUBLIC_INFURA_ID

const Web3 = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { colorMode } = useColorMode()
  const { state, dispatch } = useApp()
  const { instance, provider, chain, address } = state

  const [currChain, setCurrChain] = useState<ChainData | null>(null)

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
      network: chain === Chain.unknown ? Chain.polygon : chain,
      cacheProvider,
      theme: colorMode === 'dark' ? 'dark' : 'light',
      providerOptions
    })
    const newInstance = await web3Modal.connect()
    const newProvider = new ethers.providers.Web3Provider(newInstance)
    const newSigner = newProvider.getSigner()
    const accounts = await newProvider.listAccounts()
    const { chainId } = await newProvider.getNetwork()
    const found = chains.find((i) => i.key === `0x${chainId.toString(16)}`)
    dispatch(setInstance(newInstance))
    dispatch(setProvider(newProvider))
    dispatch(setSigner(newSigner))
    dispatch(setAddress(accounts[0]))
    if (found) {
      dispatch(setChain(found.id))
    }
  }, [dispatch, chain, colorMode])

  useEffect(() => {
    const checkCache = async () => {
      await connect()
    }
    if (!instance && cacheProvider) {
      if (localStorage.getItem('WEB3_CONNECT_CACHED_PROVIDER')) {
        checkCache()
      }
    }
  }, [instance, connect])

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
