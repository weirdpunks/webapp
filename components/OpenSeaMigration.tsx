import { erc1155abi } from '@/artifacts/erc1155'
import { weirdPunksLayer2Abi } from '@/artifacts/weirdPunksLayer2'
import { weirdPunksMainnetAbi } from '@/artifacts/weirdPunksMainnet'
import { updateOpenSeaBalance, useApp } from '@/components/Context'
import { openSea, weirdPunks as wp } from '@/utils/contracts'
import { ethereum, mumbai, polygon, rinkeby } from '@/utils/mappings'
// import { getErrorMessage } from '@/utils/formatters'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  CircularProgress,
  Flex,
  Icon,
  Link,
  Stack,
  Text,
  useToast
} from '@chakra-ui/react'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { FaCheckCircle } from 'react-icons/fa'

interface Mapping {
  id: number
  osid: string
}

const OpenSeaMigration = () => {
  // const toast = useToast()
  const { state, dispatch } = useApp()
  const { osMainnet, osLayer2, chainId, signer, address, isLayer2 } = state

  const [loading, setLoading] = useState(true)
  const [weirdPunks, setWeirdPunks] = useState<number[]>()
  const [isApprovedForAll, setIsApprovedForAll] = useState(false)
  const [openSeaContract, setOpenSeaContract] = useState('')
  const [weirdPunksContract, setWeirdPunksContract] = useState('')
  const [mapping, setMapping] = useState<Mapping[]>()
  const [os, setOS] = useState<ethers.Contract>()
  const [checkApproval, setCheckApproval] = useState(true)
  const [migrating, setMigrating] = useState(false)
  const [changingApproval, setChangingApproval] = useState(false)
  const [blockExplorer, setBlockExplorer] = useState('')
  const [permissionTx, setPermissionTx] = useState('')
  const [migrateTx, setMigrateTx] = useState('')
  // const [error, setError] = useState('')

  // useEffect(() => {
  //   if (error !== '') {
  //     toast({
  //       title: "Something's not right.",
  //       description: error,
  //       status: 'error',
  //       duration: 9000,
  //       isClosable: true
  //     })
  //     setError('')
  //   }
  // }, [error, toast])

  useEffect(() => {
    const checkOSApproval = async () => {
      const isApproved = await os?.isApprovedForAll(address, weirdPunksContract)
      if (isApproved) {
        setIsApprovedForAll(true)
      }
      setCheckApproval(false)
      setChangingApproval(false)
    }
    if (os && checkApproval) {
      checkOSApproval()
    }
  }, [os, checkApproval, address, weirdPunksContract])

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
      setBlockExplorer('https://mumbai.polygonscan.com/tx/')
      setMapping(mumbai)
    } else if (chainId === 137) {
      setWeirdPunks(osLayer2)
      setOpenSeaContract(openSea.polygon)
      setWeirdPunksContract(wp.polygon)
      setBlockExplorer('https://polygonscan.com/tx/')
      setMapping(polygon)
    } else if (chainId === 4) {
      setWeirdPunks(osMainnet)
      setOpenSeaContract(openSea.rinkeby)
      setWeirdPunksContract(wp.rinkeby)
      setBlockExplorer('https://rinkeby.etherscan.io/tx/')
      setMapping(rinkeby)
    } else if (chainId === 1) {
      setWeirdPunks(osMainnet)
      setOpenSeaContract(openSea.mainnet)
      setWeirdPunksContract(wp.mainnet)
      setBlockExplorer('https://etherscan.io/tx/')
      setMapping(ethereum)
    }
    setLoading(false)
  }, [chainId, osMainnet, osLayer2])

  const updateOSBalance = async () => {
    if (mapping && mapping.length > 0) {
      const addresses = new Array(mapping.length).fill(address)
      const ids = mapping?.map((i) => i.osid)
      const balance = await os?.balanceOfBatch(addresses, ids)
      let found = []
      for (let i = 0; i < balance.length; i++) {
        if (balance[i].toString() === '1') {
          found.push(mapping[i].id)
        }
      }
      dispatch(updateOpenSeaBalance(found))
      setWeirdPunks(found)
    }
  }

  const handlePermission = async () => {
    try {
      setChangingApproval(true)
      const transaction = await os?.setApprovalForAll(weirdPunksContract, true)
      setPermissionTx(transaction.hash)
      await transaction.wait()
      setCheckApproval(true)
    } catch (_e) {
      // const msg = getErrorMessage(e)
      // if (msg !== '') {
      //   setError(msg)
      // }
      setChangingApproval(false)
    }
  }

  const handleBurnAndMint = async () => {
    try {
      setMigrating(true)
      const abi = isLayer2 ? weirdPunksLayer2Abi : weirdPunksMainnetAbi
      const wp = new ethers.Contract(weirdPunksContract, abi, signer)
      const gas = await wp.estimateGas.burnAndMint(address, weirdPunks)
      const gasFormat = ethers.utils.formatUnits(gas, 'wei')
      var overrideOptions = {
        gasLimit: gasFormat
      }
      const transaction = await wp.burnAndMint(
        address,
        weirdPunks,
        overrideOptions
      )
      setMigrateTx(transaction.hash)
      await transaction.wait()
      await updateOSBalance()
      setMigrating(false)
    } catch (_e) {
      // const msg = getErrorMessage(e)
      // setError(JSON.stringify(msg))
      setMigrating(false)
    }
  }

  return loading ? (
    <CircularProgress size={'32px'} isIndeterminate color='green.300' />
  ) : (
    <Box>
      <Stack direction={'row'} align={'center'}>
        <Text fontSize={'xl'} fontWeight={200} p={2}>
          {weirdPunks && weirdPunks.length > 0
            ? `Open Sea Weird Punk IDs: ${weirdPunks.join(', ')}`
            : 'No Open Sea Weird Punks found to migrate...'}
        </Text>
      </Stack>
      {weirdPunks && weirdPunks.length === 0 && migrateTx !== '' && (
        <Alert status='success'>
          <AlertIcon />
          <Box flex={1}>
            <AlertTitle>Successfully Migrated!</AlertTitle>

            <AlertDescription display='block' px={4}>
              <Link href={`${blockExplorer}${migrateTx}`} isExternal={true}>
                View transaction <ExternalLinkIcon mx='2px' />
              </Link>
            </AlertDescription>
          </Box>
        </Alert>
      )}
      {weirdPunks && weirdPunks.length > 0 && (
        <>
          <Box m={5}>
            <Text>Step 1. OpenSea Permission</Text>
            {checkApproval ? (
              <CircularProgress
                size={'32px'}
                isIndeterminate
                color='green.300'
              />
            ) : (
              <>
                {!isApprovedForAll ? (
                  <>
                    {changingApproval ? (
                      <>
                        <CircularProgress
                          size={'12px'}
                          isIndeterminate
                          color='green.300'
                        />
                      </>
                    ) : (
                      <Button
                        onClick={handlePermission}
                        disabled={Boolean(!os || weirdPunksContract === '')}>
                        Authorize{' '}
                      </Button>
                    )}
                  </>
                ) : (
                  <Stack direction={'row'} align={'center'}>
                    <Flex
                      w={8}
                      h={8}
                      align={'center'}
                      justify={'center'}
                      rounded={'full'}>
                      <Icon as={FaCheckCircle} color='green.500' />
                    </Flex>
                    <Text fontWeight={600}>Approved</Text>
                  </Stack>
                )}
              </>
            )}
            {permissionTx !== '' && (
              <Box p={4}>
                <Link
                  href={`${blockExplorer}${permissionTx}`}
                  isExternal={true}>
                  View transaction <ExternalLinkIcon mx='2px' />
                </Link>
              </Box>
            )}
          </Box>
          <Box mx={5} my={10}>
            <Text>Step 2. Burn & Mint</Text>
            {migrating ? (
              <>
                <CircularProgress
                  size={'12px'}
                  isIndeterminate
                  color='green.300'
                />
              </>
            ) : (
              <Button onClick={handleBurnAndMint} disabled={!isApprovedForAll}>
                Migrate from OpenSea
              </Button>
            )}
            {migrateTx !== '' && (
              <Box p={4}>
                <Link href={`${blockExplorer}${migrateTx}`} isExternal={true}>
                  View transaction <ExternalLinkIcon mx='2px' />
                </Link>
              </Box>
            )}
          </Box>
        </>
      )}
    </Box>
  )
}

export default OpenSeaMigration
