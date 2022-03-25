import WalletConnectProvider from '@walletconnect/web3-provider'
import WalletLink from 'walletlink'

const infuraId = process.env.NEXT_PUBLIC_INFURA_ID
export const providerOptions = {
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
