import { useApp } from '@/components/Context'
import { Box, CircularProgress, Stack, Text } from '@chakra-ui/react'
import Image from 'next/image'
import { useState, useEffect } from 'react'

const WeirdTokens = () => {
  const { state } = useApp()
  const {
    isLoadingBalances,
    weirdEthereum,
    weirdPolygon,
    weirdGoerli,
    weirdMumbai,
    isTestnet
  } = state

  const [mainnetTokens, setMainnetTokens] = useState(0)
  const [layer2Tokens, setLayer2Tokens] = useState(0)

  useEffect(() => {
    if (isTestnet) {
      setMainnetTokens(weirdGoerli)
      setLayer2Tokens(weirdMumbai)
    } else {
      setMainnetTokens(weirdEthereum)
      setLayer2Tokens(weirdPolygon)
    }
  }, [isTestnet, weirdEthereum, weirdPolygon, weirdGoerli, weirdMumbai])

  return isLoadingBalances ? (
    <CircularProgress value={80} />
  ) : (
    <>
      {(mainnetTokens > 0 || layer2Tokens > 0) && (
        <Box textAlign='center' py={10} px={6}>
          {mainnetTokens > 0 && (
            <Stack direction={'row'} align={'center'} justify={'center'}>
              <Image
                src='/icons/aWeirdTokenMainnet.png'
                width={34}
                height={34}
                alt='$WEIRD'
              />
              <Text fontWeight={600}>{mainnetTokens.toLocaleString()}</Text>
            </Stack>
          )}
          {layer2Tokens > 0 && (
            <Stack direction={'row'} align={'center'} justify={'center'}>
              <Image
                src='/icons/aWeirdTokenPolygon.png'
                width={34}
                height={34}
                alt='$WEIRD'
              />
              <Text fontWeight={600}>{layer2Tokens.toLocaleString()}</Text>
            </Stack>
          )}
        </Box>
      )}
    </>
  )
}

export default WeirdTokens
