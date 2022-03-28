import { useApp } from '@/components/Context'
import {
  Box,
  Button,
  Flex,
  Icon,
  Stack,
  Text,
  useCallbackRef
} from '@chakra-ui/react'
import { FaCheckCircle } from 'react-icons/fa'
import { useEffect, useState } from 'react'

interface Mapping {
  id: number
  osid: string
}

const OpenSeaMigration = () => {
  const { state } = useApp()
  const { osEthereum, osPolygon, osRinkeby, osMumbai, chainId } = state

  const [granted, setGranted] = useState(false)
  const [weirdPunks, setWeirdPunks] = useState<number[]>()

  useEffect(() => {
    if (chainId === 80001) {
      setWeirdPunks(osMumbai)
    } else if (chainId === 137) {
      setWeirdPunks(osPolygon)
    } else if (chainId === 4) {
      setWeirdPunks(osRinkeby)
    } else if (chainId === 1) {
      setWeirdPunks(osEthereum)
    }
  }, [chainId, osEthereum, osPolygon, osRinkeby, osMumbai])

  const handlePermission = async () => {
    setGranted(true)
  }
  const handleBurnAndMint = async () => {}

  return (
    <Box>
      {weirdPunks && weirdPunks.length > 0 && (
        <Stack direction={'row'} align={'center'}>
          <Text fontSize={'xl'} fontWeight={200} p={2}>
            {`Unmigrated Weird Punks: ${weirdPunks.join(', ')}`}
          </Text>
        </Stack>
      )}
      <Text>1. Permission to Burn 🔥 OpenSea Assets?</Text>
      {granted ? (
        <Stack direction={'row'} align={'center'}>
          <Flex
            w={8}
            h={8}
            align={'center'}
            justify={'center'}
            rounded={'full'}>
            <Icon as={FaCheckCircle} color='green.500' />
          </Flex>
          <Text fontWeight={600}>Permission Granted</Text>
        </Stack>
      ) : (
        <Button onClick={handlePermission}>Authorize</Button>
      )}
      <Text>2. Burn 🔥 OpenSea Weird Punk & Mint Migrated Weird Punk</Text>
      <Button onClick={handleBurnAndMint} disabled={!granted}>
        Yes please 🙏
      </Button>
    </Box>
  )
}

export default OpenSeaMigration
