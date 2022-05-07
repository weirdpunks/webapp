import { useApp } from '@/components/Context'
import { weird } from '@/utils/contracts'
import { Box, CircularProgress, Link, Stack, Text } from '@chakra-ui/react'
import Image from 'next/image'

const WeirdTokens = () => {
  const { state } = useApp()
  const {
    isLoadingBalances,
    weirdMainnet,
    weirdLayer2,
    isTestnet,
    isLayer2,
    address
  } = state

  const addPolygonWeirdToken = async () => {
    try {
      await window?.ethereum?.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: isTestnet ? weird.mumbai : weird.polygon,
            symbol: 'WEIRD',
            decimals: 18,
            image:
              'https://raw.githubusercontent.com/weirdpunks/webapp/main/public/icons/weirdTokenPolygon.png'
          }
        }
      })
    } catch (error) {
      console.log(error)
    }
  }
  const addEthereumWeirdToken = async () => {
    try {
      await window?.ethereum?.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: isTestnet ? weird.goerli : weird.mainnet,
            symbol: 'WEIRD',
            decimals: 18,
            image:
              'https://raw.githubusercontent.com/weirdpunks/webapp/main/public/icons/weirdTokenMainnet.png'
          }
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  return isLoadingBalances ? (
    <CircularProgress value={80} />
  ) : (
    <>
      {address !== '' && (
        <Box textAlign='center' py={10} px={6}>
          {weirdMainnet > 0 && (
            <Stack direction={'row'} align={'center'} justify={'center'}>
              {!isLayer2 ? (
                <Link onClick={addEthereumWeirdToken}>
                  <Image
                    src='/icons/aWeirdTokenMainnet.png'
                    width={34}
                    height={34}
                    alt='$WEIRD'
                  />
                </Link>
              ) : (
                <Image
                  src='/icons/aWeirdTokenMainnet.png'
                  width={34}
                  height={34}
                  alt='$WEIRD'
                />
              )}

              <Text fontWeight={600}>{weirdMainnet.toLocaleString()}</Text>
            </Stack>
          )}
          <Stack direction={'row'} align={'center'} justify={'center'}>
            {isLayer2 ? (
              <Link onClick={addPolygonWeirdToken}>
                <Image
                  src='/icons/aWeirdTokenPolygon.png'
                  width={34}
                  height={34}
                  alt='$WEIRD'
                />
              </Link>
            ) : (
              <Image
                src='/icons/aWeirdTokenPolygon.png'
                width={34}
                height={34}
                alt='$WEIRD'
              />
            )}
            <Text fontWeight={600}>{weirdLayer2.toLocaleString()}</Text>
          </Stack>
        </Box>
      )}
    </>
  )
}

export default WeirdTokens
