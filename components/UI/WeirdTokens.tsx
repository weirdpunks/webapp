import { useApp } from '@/components/Context'
import { weird } from '@/utils/contracts'
import { Box, CircularProgress, Link, Stack, Text } from '@chakra-ui/react'
import Image from 'next/image'

const WeirdTokens = () => {
  const { state } = useApp()
  const { isLoadingBalances, weirdMainnet, weirdLayer2, isTestnet, isLayer2 } =
    state

  const addWeirdToken = async () => {
    try {
      await await window?.ethereum?.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: isTestnet ? weird.mumbai : weird.polygon,
            symbol: 'WEIRD',
            decimals: 18,
            image:
              'https://github.com/weirdpunks/webapp/blob/main/public/icons/weirdTokenPolygonMetaMask.png?raw=true'
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
      {(weirdMainnet > 0 || weirdLayer2 > 0) && (
        <Box textAlign='center' py={10} px={6}>
          {weirdMainnet > 0 && (
            <Stack direction={'row'} align={'center'} justify={'center'}>
              <Image
                src='/icons/aWeirdTokenMainnet.png'
                width={34}
                height={34}
                alt='$WEIRD'
              />
              <Text fontWeight={600}>{weirdMainnet.toLocaleString()}</Text>
            </Stack>
          )}
          {weirdLayer2 > 0 && (
            <Stack direction={'row'} align={'center'} justify={'center'}>
              {isLayer2 ? (
                <Link onClick={addWeirdToken}>
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
          )}
        </Box>
      )}
    </>
  )
}

export default WeirdTokens
