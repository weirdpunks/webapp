import { weirdPunksLayer2Abi } from '@/artifacts/weirdPunksLayer2'
import { weirdPunksMainnetAbi } from '@/artifacts/weirdPunksMainnet'
import { erc20abi } from '@/artifacts/erc20'
import { useApp } from '@/components/Context'
import { weirdPunks as weirdPunksAddress, weth, weird } from '@/utils/contracts'
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
  Input,
  Link,
  Stack,
  Text
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { FaCheckCircle } from 'react-icons/fa'
import { ethers } from 'ethers'
import axios from 'axios'
import { useCallback, useEffect, useState, ChangeEvent } from 'react'

const infuraId = process.env.NEXT_PUBLIC_INFURA_ID
const gasApiUrl = process.env.NEXT_PUBLIC_GAS_API_URL

const Bridge = () => {
  const { state } = useApp()
  const { signer, address, isLayer2, isTestnet, weirdPunksLayer2 } = state

  const [loading, setLoading] = useState(true)
  const [ids, setIds] = useState('')

  const [weirdPunksContract, setWeirdPunksContract] =
    useState<ethers.Contract>()
  const [wethContract, setWETHContract] = useState<ethers.Contract>()
  const [weirdBridgeFee, setWeirdBridgeFee] = useState(999999)
  const [weirdContract, setWeirdContract] = useState<ethers.Contract>()
  const [wethApproved, setWETHApproved] = useState(false)
  const [weirdApproved, setWeirdApproved] = useState(false)
  const [wethEstimate, setWethEstimate] = useState(0.0)

  const [mainnetProvider, setMainnetProvider] =
    useState<ethers.providers.JsonRpcProvider>()
  const [mainnetExplorer, setMainnetExplorer] = useState('')
  const [layer2Explorer, setLayer2Explorer] = useState('')

  const [approvingWETHToken, setApprovingWETHToken] = useState(false)
  const [wethApprovalTx, setWETHApprovalTx] = useState('')
  const [checkingWETHApproval, setCheckingWETHApproval] = useState(true)
  const [approvingWeirdToken, setApprovingWeirdToken] = useState(false)
  const [weirdApprovalTx, setWeirdApprovalTx] = useState('')
  const [checkingWeirdApproval, setCheckingWeirdApproval] = useState(false)

  const [bridgeTx, setBridgeTx] = useState('')
  const [bridging, setBridging] = useState(false)

  useEffect(() => {
    const loadWeirdPunksContract = async () => {
      const wpContract = new ethers.Contract(
        isTestnet ? weirdPunksAddress.mumbai : weirdPunksAddress.polygon,
        weirdPunksLayer2Abi,
        signer
      )
      setWeirdPunksContract(wpContract)
    }
    if (isLayer2 && address !== '' && weirdPunksContract === undefined) {
      loadWeirdPunksContract()
    }
  }, [isLayer2, isTestnet, weirdPunksContract, address, signer])

  useEffect(() => {
    const loadWETHContract = async () => {
      const erc20 = new ethers.Contract(
        isTestnet ? weth.mumbai : weth.polygon,
        erc20abi,
        signer
      )
      setWETHContract(erc20)
    }
    if (isLayer2 && address !== '' && wethContract === undefined) {
      loadWETHContract()
    }
  }, [isLayer2, isTestnet, wethContract, address, signer])

  useEffect(() => {
    const wpReady = async () => {
      try {
        const fee = await weirdPunksContract?.WEIRD_BRIDGE_FEE()
        setWeirdBridgeFee(parseInt(ethers.utils.formatUnits(fee, 'ether')))
      } catch (e) {
        console.log(e)
        // setWeirdBridgeFee(0)
      }
    }

    if (weirdPunksContract !== undefined) {
      wpReady()
    }
  }, [weirdPunksContract])

  useEffect(() => {
    const loadWeirdContract = async () => {
      const erc20 = new ethers.Contract(
        isTestnet ? weird.mumbai : weird.polygon,
        erc20abi,
        signer
      )
      setWeirdContract(erc20)
      setCheckingWeirdApproval(true)
    }
    if (
      isLayer2 &&
      address !== '' &&
      weirdContract === undefined &&
      weirdBridgeFee < 999999 &&
      weirdBridgeFee > 0
    ) {
      loadWeirdContract()
    }
  }, [isLayer2, weirdBridgeFee, isTestnet, weirdContract, address, signer])

  useEffect(() => {
    const wethReady = async () => {
      const isWETHApproved = await wethContract?.allowance(
        address,
        isTestnet ? weirdPunksAddress.mumbai : weirdPunksAddress.polygon
      )
      if (
        isWETHApproved &&
        isWETHApproved._hex ===
          '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
      ) {
        setWETHApproved(true)
      }
      setCheckingWETHApproval(false)
    }

    if (address !== '' && wethContract !== undefined) {
      wethReady()
    }
  }, [wethContract, isTestnet, address])

  useEffect(() => {
    const weirdReady = async () => {
      const isWeirdApproved = await weirdContract?.allowance(
        address,
        isTestnet ? weirdPunksAddress.mumbai : weirdPunksAddress.polygon
      )
      if (
        isWeirdApproved &&
        isWeirdApproved._hex ===
          '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
      ) {
        setWeirdApproved(true)
      }
      setCheckingWeirdApproval(false)
    }

    if (address !== '' && weirdContract !== undefined) {
      weirdReady()
    }
  }, [weirdContract, isTestnet, address])

  useEffect(() => {
    const init = () => {
      setMainnetProvider(
        new ethers.providers.JsonRpcProvider(
          `https://${
            isTestnet ? 'rinkeby' : 'mainnet'
          }.infura.io/v3/${infuraId}`
        )
      )
      setMainnetExplorer(
        `https://${isTestnet ? 'rinkeby.' : ''}etherscan.io/tx/`
      )
      setLayer2Explorer(
        `https://${isTestnet ? 'mumbai.' : ''}polygonscan.com/tx/`
      )
    }
    if (isLayer2) {
      init()
    }
  }, [isTestnet, isLayer2])

  useEffect(() => {
    setIds(weirdPunksLayer2.join(', '))
  }, [weirdPunksLayer2])

  const welcome = isTestnet
    ? 'Bridge from Mumbai to Rinkeby'
    : 'Bridge from Polygon to Ethereum'

  const handleIds = (e: ChangeEvent<HTMLInputElement>) => {
    setIds(e.target.value)
  }

  const getMainnetGasFee = async () => {
    try {
      interface GASAPI {
        response: string
      }
      const res = await axios.get<GASAPI>(gasApiUrl as string, {
        params: {
          ids: ids
            .split(', ')
            .map((i) => parseInt(i))
            .join(',')
        }
      })
      return res.data
    } catch (e) {
      // console.log(JSON.stringify(e, null, 2))
      return ''
    }
  }

  const handleWETHApprove = async () => {
    try {
      setApprovingWETHToken(true)
      const transaction = await wethContract?.approve(
        isTestnet ? weirdPunksAddress.mumbai : weirdPunksAddress.polygon,
        '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
      )
      setWETHApprovalTx(transaction.hash)
      await transaction.wait()
      setApprovingWETHToken(false)
    } catch (e) {
      console.log(e)
    }
  }
  const handleApproveWeirdToken = async () => {
    try {
      setApprovingWeirdToken(true)
      const transaction = await weirdContract?.approve(
        isTestnet ? weirdPunksAddress.mumbai : weirdPunksAddress.polygon,
        '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
      )
      setWeirdApprovalTx(transaction.hash)
      await transaction.wait()
      setApprovingWeirdToken(false)
    } catch (e) {
      console.log(e)
    }
  }

  const handleBridge = async () => {
    try {
      setBridging(true)
      const bridgeIds = ids.split(', ').map((i) => parseInt(i))

      const contract = isTestnet
        ? weirdPunksAddress.mumbai
        : weirdPunksAddress.polygon
      const weirdPunks = new ethers.Contract(
        contract,
        weirdPunksLayer2Abi,
        signer
      )

      if (mainnetProvider && weirdPunks) {
        const currEthGas = await (
          await mainnetProvider.getGasPrice()
        ).toString()
        console.log(currEthGas, 'Current ETH Gas')
        const oracleEthGas = await weirdPunks.gasETH()
        console.log(oracleEthGas, 'Oracle ETH Gas')

        const ethGas = currEthGas > oracleEthGas ? currEthGas : oracleEthGas

        console.log(ethGas, 'ETH Gas')
        // const txn = wpL2.batchBridge(bridgeIds, gas)
        // setBridgeTx(txn.hash)
        // await txn.wait()
      }

      setBridging(false)
    } catch (e) {
      console.log(e)
    }
  }

  return !isLayer2 ? (
    <Text>Please switch to {isTestnet ? 'Mumbai' : 'Polygon'}</Text>
  ) : (
    <Box>
      <Text>{welcome}</Text>
      <Button onClick={() => getMainnetGasFee()}>Gas Check</Button>

      {weirdPunksLayer2 && weirdPunksLayer2.length === 0 && bridgeTx !== '' && (
        <Alert status='success'>
          <AlertIcon />
          <Box flex={1}>
            <AlertTitle>Successfully Bridged!</AlertTitle>

            <AlertDescription display='block' px={4}>
              <Link href={`${layer2Explorer}${bridgeTx}`} isExternal={true}>
                View transaction <ExternalLinkIcon mx='2px' />
              </Link>
            </AlertDescription>
          </Box>
        </Alert>
      )}

      {weirdPunksLayer2 && weirdPunksLayer2.length > 0 && (
        <>
          <Box>
            <Text>
              Step 1. Approve WEIRD{' '}
              {weirdBridgeFee !== 999999 &&
                `(Bridge fee is ${weirdBridgeFee} WEIRD for each Weird Punk.)`}
            </Text>
            {checkingWeirdApproval ? (
              <CircularProgress
                size={'32px'}
                isIndeterminate
                color='green.300'
              />
            ) : (
              <>
                {!weirdApproved ? (
                  <>
                    {approvingWeirdToken ? (
                      <>
                        <CircularProgress
                          size={'12px'}
                          isIndeterminate
                          color='green.300'
                        />
                      </>
                    ) : (
                      <Button onClick={handleApproveWeirdToken}>
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
            {weirdApprovalTx !== '' && (
              <Box p={4}>
                <Link
                  href={`${layer2Explorer}${weirdApprovalTx}`}
                  isExternal={true}>
                  View transaction <ExternalLinkIcon mx='2px' />
                </Link>
              </Box>
            )}
          </Box>
          <Box>
            <Text>Step 2. Approve WETH</Text>
            {checkingWETHApproval ? (
              <CircularProgress
                size={'32px'}
                isIndeterminate
                color='green.300'
              />
            ) : (
              <>
                {!wethApproved ? (
                  <>
                    {approvingWETHToken ? (
                      <>
                        <CircularProgress
                          size={'12px'}
                          isIndeterminate
                          color='green.300'
                        />
                      </>
                    ) : (
                      <Button onClick={handleWETHApprove}>Authorize </Button>
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
            {wethApprovalTx !== '' && (
              <Box p={4}>
                <Link
                  href={`${layer2Explorer}${wethApprovalTx}`}
                  isExternal={true}>
                  View transaction <ExternalLinkIcon mx='2px' />
                </Link>
              </Box>
            )}
          </Box>
          <Box mx={5} my={10}>
            <Text>Step 3. Bridge to Mainnet</Text>
            {bridging ? (
              <>
                <CircularProgress
                  size={'12px'}
                  isIndeterminate
                  color='green.300'
                />
              </>
            ) : (
              <>
                <Input
                  placeholder='Weird Punk IDs (comma separated)'
                  value={ids}
                  onChange={handleIds}
                />
                {weirdBridgeFee !== 999999 && (
                  <Text>Polygon WEIRD Bridge Fee: {weirdBridgeFee}</Text>
                )}
                {wethEstimate !== 0.0 && (
                  <Text>Polygon WETH Gas Fee: {wethEstimate}</Text>
                )}
                <Button onClick={handleBridge} disabled={!wethApproved}>
                  Bridge
                </Button>
              </>
            )}
            {bridgeTx !== '' && (
              <Box p={4}>
                <Link href={`${layer2Explorer}${bridgeTx}`} isExternal={true}>
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

export default Bridge
