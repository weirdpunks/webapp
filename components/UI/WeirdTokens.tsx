import { useApp } from '@/components/Context'
import { Box, CircularProgress, Stack, Text } from '@chakra-ui/react'
import Image from 'next/image'

const WeirdTokens = () => {
  const { state } = useApp()
  const { isLoadingBalances, weirdMainnet, weirdLayer2 } = state

  return isLoadingBalances ? (
    <CircularProgress value={80} />
  ) : (
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
      <Stack direction={'row'} align={'center'} justify={'center'}>
        <Image
          src='/icons/aWeirdTokenPolygon.png'
          width={34}
          height={34}
          alt='$WEIRD'
        />
        <Text fontWeight={600}>{weirdLayer2.toLocaleString()}</Text>
      </Stack>
    </Box>
  )
}

export default WeirdTokens
