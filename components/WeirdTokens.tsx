import { useApp } from './Context/Index'
import { Box, Heading, HStack, Stack, Text } from '@chakra-ui/react'
import Image from 'next/image'

const WeirdTokens = () => {
  const { state, dispatch } = useApp()
  const { weirdMainnet, weirdLayer2 } = state

  return (
    <Box textAlign='center' py={10} px={6}>
      {weirdMainnet > 0 && (
        <HStack>
          <Box flex={1}>
            <Heading as='h3' size='lg' mt={6} mb={2}>
              {weirdMainnet}
            </Heading>
          </Box>
          <Box flex={1}>
            <Image
              src='/icons/weirdTokenMainnet.png'
              width={34}
              height={34}
              alt='$WEIRD'
            />
          </Box>
        </HStack>
      )}
      <Stack direction={'row'} align={'center'} justify={'center'}>
        <Text fontSize={'6xl'} fontWeight={800} p={4}>
          {weirdLayer2}
        </Text>
        <Text fontSize={'xl'} fontWeight={200} p={2}>
          X
        </Text>
        <Image
          src='/icons/weirdTokenPolygon.png'
          width={34}
          height={34}
          alt='$WEIRD'
        />
      </Stack>
    </Box>
  )
}

export default WeirdTokens
