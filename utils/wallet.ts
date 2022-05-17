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

export const polygonProviderOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId,
      rpc: {
        137: `https://polygon-mainnet.infura.io/v3/${infuraId}`
      }
    }
  },
  walletlink: {
    package: WalletLink,
    options: {
      appName: 'Weird Punks',
      rpc: `https://polygon-mainnet.infura.io/v3/${infuraId}`,
      chainId: 137
    }
  }
}
