import { useApp } from './Context/Index'
import { Box, Stack, Text } from '@chakra-ui/react'
import Image from 'next/image'

const WeirdTokens = () => {
  const { state } = useApp()
  const { weirdMainnet, weirdLayer2 } = state

  return (
    <Box textAlign='center' py={10} px={6}>
      {weirdMainnet > 0 && (
        <Stack direction={'row'} align={'center'} justify={'center'}>
          <Text fontSize={'6xl'} fontWeight={600} p={2}>
            {weirdMainnet.toLocaleString()}
          </Text>
          <Text fontSize={'xl'} fontWeight={200} p={2}>
            X
          </Text>
          <Image
            src='/icons/aWeirdTokenMainnet.png'
            width={34}
            height={34}
            alt='$WEIRD'
          />
        </Stack>
      )}
      <Stack direction={'row'} align={'center'} justify={'center'}>
        <Text fontSize={'6xl'} fontWeight={600} p={2}>
          {weirdLayer2.toLocaleString()}
        </Text>
        <Text fontSize={'xl'} fontWeight={200} p={2}>
          X
        </Text>
        <Image
          src='/icons/aWeirdTokenPolygon.png'
          width={34}
          height={34}
          alt='$WEIRD'
        />
      </Stack>
    </Box>
  )
}

export default WeirdTokens
