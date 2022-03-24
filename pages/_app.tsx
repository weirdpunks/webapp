import UI from '@/components/UI/UI'
import { AppProvider } from '@/components/Context'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import type { AppProps } from 'next/app'

const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac'
  }
}
const theme = extendTheme({ colors })

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <AppProvider>
        <UI>
          <Component {...pageProps} />
        </UI>
      </AppProvider>
    </ChakraProvider>
  )
}
export default MyApp
