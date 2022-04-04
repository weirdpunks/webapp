import { erc1155abi } from '@/artifacts/erc1155'
import { useApp } from '@/components/Context'
import { openSea, weirdPunks as wp } from '@/utils/contracts'
import { Box, Button, Flex, Icon, Stack, Text } from '@chakra-ui/react'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { FaCheckCircle } from 'react-icons/fa'

interface Mapping {
  id: number
  osid: string
}

const OpenSeaMigration = () => {
  const { state } = useApp()
  const { osMainnet, osLayer2, chainId, signer, address } = state

  const [weirdPunks, setWeirdPunks] = useState<number[]>()
  const [isApprovedForAll, setIsApprovedForAll] = useState(false)
  const [openSeaContract, setOpenSeaContract] = useState('')
  const [weirdPunksContract, setWeirdPunksContract] = useState('')
  const [os, setOS] = useState<ethers.Contract>()
  const [checkApproval, setCheckApproval] = useState(true)

  // const checkIfApproved = useCallback(async () => {}, [weirdPunksContract, openSeaContract, signer])

  useEffect(() => {
    const checkApproval = async () => {
      const isApproved = await os?.isApprovedForAll(address, weirdPunksContract)
      if (isApproved) {
        setIsApprovedForAll(true)
      }
      setCheckApproval(false)
    }
    if (os && checkApproval) {
      checkApproval()
    }
  }, [os, checkApproval])

  useEffect(() => {
    const setupOpenSea = async () => {
      const erc1155 = new ethers.Contract(openSeaContract, erc1155abi, signer)
      setOS(erc1155)
    }
    if (address !== '' && openSeaContract !== '' && weirdPunksContract !== '') {
      setupOpenSea()
    }
  }, [openSeaContract, weirdPunksContract, address, signer])

  useEffect(() => {
    if (chainId === 80001) {
      setWeirdPunks(osLayer2)
      setOpenSeaContract(openSea.mumbai)
      setWeirdPunksContract(wp.mumbai)
    } else if (chainId === 137) {
      setWeirdPunks(osLayer2)
      setOpenSeaContract(openSea.polygon)
    } else if (chainId === 4) {
      setWeirdPunks(osMainnet)
      setOpenSeaContract(openSea.rinkeby)
      setWeirdPunksContract(wp.rinkeby)
    } else if (chainId === 1) {
      setWeirdPunks(osMainnet)
      setOpenSeaContract(openSea.mainnet)
    }
  }, [chainId, osMainnet, osLayer2])

  const handlePermission = async () => {
    const transaction = await os?.setApprovalForAll(weirdPunksContract, true)
    await transaction.wait()
    setCheckApproval(true)
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
          <Button
            onClick={handlePermission}
            disabled={Boolean(!os || weirdPunksContract === '')}>
            Authorize
          </Button>
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
