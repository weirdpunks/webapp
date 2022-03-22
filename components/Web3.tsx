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
import { chains } from '../utils/chains'
import { ethers } from 'ethers'
import WalletConnectProvider from '@walletconnect/web3-provider'
import WalletLink from 'walletlink'
import Web3Modal from 'web3modal'
import { Button, Icon, useColorMode } from '@chakra-ui/react'
import { FaWallet } from 'react-icons/fa'
import { useCallback, useEffect } from 'react'

const cacheProvider = true
const infuraId = process.env.NEXT_PUBLIC_INFURA_ID

const Web3 = () => {
  const { colorMode } = useColorMode()
  const { state, dispatch } = useApp()
  const { instance, provider, chain, address } = state

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
      providerOptions
    })
    const newInstance = await web3Modal.connect()
    const newProvider = new ethers.providers.Web3Provider(newInstance)
    const newSigner = newProvider.getSigner()
    const accounts = await newProvider.listAccounts()
    dispatch(setInstance(newInstance))
    dispatch(setProvider(newProvider))
    dispatch(setSigner(newSigner))
    dispatch(setAddress(accounts[0]))
  }, [dispatch, chain])

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

  const handleWalletClick = () => {
    const openConnection = async () => {
      await connect()
    }
    openConnection()
  }

  return (
    <>
      {address ? (
        <Button>
          <Address address={address} avatar='right' size={4} />
        </Button>
      ) : (
        <Button onClick={handleWalletClick}>
          <Icon as={FaWallet} />
        </Button>
      )}
    </>
  )
}

export default Web3
