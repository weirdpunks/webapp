import { useApp } from '@/components/Context'
import { useEffect } from 'react'

const Events = () => {
  const { state } = useApp()
  const { provider } = state

  useEffect(() => {
    if (
      typeof window.ethereum !== 'undefined' ||
      typeof window.web3 !== 'undefined'
    ) {
      console.log('WEB3 READY')
    } else {
      console.log('NGMI')
    }
  }, [])

  // if (provider?.on) {
  //   const handleAccountsChanged = (accounts: string[]) => {
  //     console.log('accountsChanged', accounts)
  //   }
  //   const handleChainChanged = (_hexChainId: string) => {
  //     window.location.reload()
  //   }

  //   const handleDisconnect = (error: { code: number; message: string }) => {
  //     console.log('disconnect', error)
  //   }

  //   provider.on('accountsChanged', handleAccountsChanged)
  //   provider.on('chainChanged', handleChainChanged)
  //   provider.on('disconnect', handleDisconnect)
  //   console.log('PROVIDER ACTIVE')
  // }

  if (provider) {
    provider.on('accountsChanged', (accounts: string[]) => {
      console.log(accounts)
    })

    // Subscribe to chainId change
    provider.on('chainChanged', (chainId: number) => {
      console.log(chainId)
    })

    // Subscribe to provider connection
    provider.on('connect', (info: { chainId: number }) => {
      console.log(info)
    })

    // Subscribe to provider disconnection
    provider.on('disconnect', (error: { code: number; message: string }) => {
      console.log(error)
    })
  }

  return null
}

export default Events
