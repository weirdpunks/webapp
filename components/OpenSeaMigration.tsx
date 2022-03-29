import { useApp } from '@/components/Context'
import { openSea, weirdPunks as wp } from '@/utils/contracts'
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
import { useEffect, useState, useCallback } from 'react'

interface Mapping {
  id: number
  osid: string
}

const OpenSeaMigration = () => {
  const { state } = useApp()
  const { osEthereum, osPolygon, osRinkeby, osMumbai, chainId } = state

  const [weirdPunks, setWeirdPunks] = useState<number[]>()
  const [isApprovedForAll, setIsApprovedForAll] = useState(false)
  const [openSeaContract, setOpenSeaContract] = useState<string>()
  const [weirdPunksContract, setWeirdPunksContract] = useState<string>()

  // const checkIfApproved = useCallback(async () => {}, [weirdPunksContract, openSeaContract, signer])

  useEffect(() => {
    if (chainId === 80001) {
      setWeirdPunks(osMumbai)
      setOpenSeaContract(openSea.mumbai)
      setWeirdPunksContract(wp.mumbai)
    } else if (chainId === 137) {
      setWeirdPunks(osPolygon)
      setOpenSeaContract(openSea.polygon)
    } else if (chainId === 4) {
      setWeirdPunks(osRinkeby)
      setOpenSeaContract(openSea.rinkeby)
      setWeirdPunksContract(wp.rinkeby)
    } else if (chainId === 1) {
      setWeirdPunks(osEthereum)
      setOpenSeaContract(openSea.mainnet)
    }
  }, [chainId, osEthereum, osPolygon, osRinkeby, osMumbai])

  const handlePermission = async () => {}
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
      <Box m={5}>
        <Text>Step 1. OpenSea Permission</Text>
        {isApprovedForAll ? (
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
      </Box>
      <Box mx={5} my={10}>
        <Text>Step 2. Burn & Mint</Text>
        <Button onClick={handleBurnAndMint} disabled={!isApprovedForAll}>
          Migrate
        </Button>
      </Box>
    </Box>
  )
}

export default OpenSeaMigration
