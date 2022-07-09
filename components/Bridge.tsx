import { weirdPunksLayer2Abi } from '@/artifacts/weirdPunksLayer2'
import { expansionsLayer2Abi } from '@/artifacts/expansionsLayer2'
import { gasCalculatorAbi } from '@/artifacts/gasCalculator'
import { erc20abi } from '@/artifacts/erc20'
import { useApp, startConnecting } from '@/components/Context'
import {
  weirdPunks as weirdPunksAddress,
  weth,
  weird,
  gasCalculator,
  expansions as expansionsAddress
} from '@/utils/contracts'
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
  Select,
  Stack,
  Text,
  useToast
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { FaCheckCircle } from 'react-icons/fa'
import { ethers } from 'ethers'
import axios from 'axios'
import { useCallback, useEffect, useState, ChangeEvent } from 'react'

const infuraId = process.env.NEXT_PUBLIC_INFURA_ID
const gasApiUrl = process.env.NEXT_PUBLIC_GAS_API_URL

interface ErrorMessage {
  message: string
}

const bigZero = ethers.BigNumber.from(0)

const Bridge = () => {
  const toast = useToast()
  const { state, dispatch } = useApp()
  const {
    signer,
    address,
    isLayer2,
    isTestnet,
    weirdPunksLayer2,
    expansionsLayer2
  } = state

  const [loading, setLoading] = useState(true)
  const [ids, setIds] = useState('')

  const [weirdPunksContract, setWeirdPunksContract] =
    useState<ethers.Contract>()
  const [expansionsContract, setExpansionsContract] =
    useState<ethers.Contract>()
  const [wethContract, setWETHContract] = useState<ethers.Contract>()
  const [weirdBridgeFee, setWeirdBridgeFee] = useState(999999)
  const [weirdContract, setWeirdContract] = useState<ethers.Contract>()
  const [wethApproved, setWETHApproved] = useState(false)
  const [weirdApproved, setWeirdApproved] = useState(false)
  const [wethEstimate, setWethEstimate] = useState('0')
  const [contractEstimate, setContractEstimate] = useState('0')
  const [wethDisplay, setWethDisplay] = useState('')

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

  const [collection, setCollection] = useState('wp')
  const [bridgeTx, setBridgeTx] = useState('')
  const [bridging, setBridging] = useState(false)
  const [bridgeComplete, setBridgeComplete] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (bridgeTx !== '') {
      if (
        (collection === 'wp' && weirdPunksLayer2.length === 0) ||
        (collection === 'ewp' && expansionsLayer2.length === 0)
      ) {
        setBridgeComplete(true)
      }
    }
  }, [collection, bridgeTx, weirdPunksLayer2, expansionsLayer2])

  // useEffect(() => {
  //   if (weirdPunksLayer2.length === 0 && expansionsLayer2.length > 0) {
  //     setCollection('exp')
  //   } else {
  //     setCollection('wp')
  //   }
  // }, [weirdPunksLayer2, expansionsLayer2])

  useEffect(() => {
    if (collection === 'wp' || collection === 'ewp') {
      setWETHApproved(false)
      setWeirdApproved(false)
    }
  }, [collection, weirdPunksLayer2, expansionsLayer2])

  useEffect(() => {
    if (errorMessage !== '') {
      toast({
        title: "Something's not right.",
        description: errorMessage,
        status: 'error',
        duration: 4000,
        isClosable: true
      })
      setErrorMessage('')
    }
  }, [errorMessage, toast])

  const getErrorMessage = (error: ErrorMessage) => {
    return String(error.message)
  }

  useEffect(() => {
    const loadWeirdPunksContract = async () => {
      const wpContract = new ethers.Contract(
        isTestnet ? weirdPunksAddress.mumbai : weirdPunksAddress.polygon,
        weirdPunksLayer2Abi,
        signer
      )
      setWeirdPunksContract(wpContract)
    }
    if (
      isLayer2 &&
      address !== '' &&
      collection === 'wp' &&
      weirdPunksContract === undefined
    ) {
      loadWeirdPunksContract()
    }
  }, [isLayer2, isTestnet, weirdPunksContract, address, signer, collection])

  useEffect(() => {
    const loadWeirdPunksContract = async () => {
      const ewpContract = new ethers.Contract(
        expansionsAddress.polygon,
        expansionsLayer2Abi,
        signer
      )
      setWeirdPunksContract(ewpContract)
    }
    if (
      isLayer2 &&
      address !== '' &&
      collection === 'ewp' &&
      expansionsContract === undefined
    ) {
      loadWeirdPunksContract()
    }
  }, [isLayer2, isTestnet, expansionsContract, address, signer, collection])

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
      }
    }

    const ewpReady = async () => {
      try {
        const fee = await expansionsContract?.WEIRD_BRIDGE_FEE()
        setWeirdBridgeFee(parseInt(ethers.utils.formatUnits(fee, 'ether')))
      } catch (e) {
        console.log(e)
      }
    }

    if (collection === 'wp' && weirdPunksContract !== undefined) {
      wpReady()
    } else if (collection === 'exp' && expansionsContract !== undefined) {
      ewpReady()
    }
  }, [collection, weirdPunksContract, expansionsContract])

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
      const contract =
        collection === 'ewp'
          ? expansionsAddress.polygon
          : isTestnet
          ? weirdPunksAddress.mumbai
          : weirdPunksAddress.polygon
      const isWETHApproved = await wethContract?.allowance(address, contract)
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
  }, [wethContract, isTestnet, address, collection])

  useEffect(() => {
    const weirdReady = async () => {
      const contract =
        collection === 'ewp'
          ? expansionsAddress.polygon
          : isTestnet
          ? weirdPunksAddress.mumbai
          : weirdPunksAddress.polygon
      const isWeirdApproved = await weirdContract?.allowance(address, contract)
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
  }, [weirdContract, isTestnet, address, collection])

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
    if (collection === 'wp') {
      setIds(weirdPunksLayer2.slice(0, 20).join(', '))
    }
    if (collection === 'ewp') {
      setIds(expansionsLayer2.slice(0, 20).join(', '))
    }
  }, [collection, weirdPunksLayer2, expansionsLayer2])

  const welcome = isTestnet
    ? 'Bridge from Mumbai to Rinkeby'
    : 'Bridge from Polygon to Ethereum'

  const handleIds = (e: ChangeEvent<HTMLInputElement>) => {
    const newIds = e.target.value.split(', ').map((i) => parseInt(i))
    setIds(newIds.slice(0, 20).join(', '))
  }

  const getMainnetGasFee = useCallback(async () => {
    try {
      const res = await axios.get(gasApiUrl as string, {
        params: {
          ids: ids
            .split(', ')
            .map((i) => parseInt(i))
            .join(',')
        }
      })
      setWethEstimate(res.data as string)
    } catch (e) {
      console.log(JSON.stringify(e, null, 2))
    }
  }, [ids])

  const getContractGasFee = useCallback(async () => {
    try {
      const bridgeIds = ids
        .split(', ')
        .map((i) => parseInt(i))
        .slice(0, 20)

      const gas = new ethers.Contract(
        gasCalculator.polygon,
        gasCalculatorAbi,
        signer
      )

      if (mainnetProvider && gas) {
        const oracleEthGas = await gas.gasETH()
        const contractGas = oracleEthGas.toNumber()
        const numberBridging = bridgeIds.length
        const contractGasTotal =
          contractGas + (numberBridging - 1) * (contractGas / 2.5)
        setContractEstimate(contractGasTotal.toFixed(0))
      }

      setBridging(false)
    } catch (e) {
      console.log(e)
    }
  }, [ids, mainnetProvider, signer])

  useEffect(() => {
    if (ids !== '') {
      getMainnetGasFee()
      getContractGasFee()
    }
  }, [ids, getMainnetGasFee, getContractGasFee])

  useEffect(() => {
    if (contractEstimate !== '0' && wethEstimate.toString() !== '0') {
      const highest =
        contractEstimate > wethEstimate.toString()
          ? contractEstimate
          : wethEstimate.toString()
      const str = ethers.utils.formatUnits(highest, 'ether')
      const rounded =
        Math.round((parseFloat(str) + Number.EPSILON) * 10000) / 10000
      setWethDisplay(rounded.toString())
    }
  }, [contractEstimate, wethEstimate])

  const handleWETHApprove = async () => {
    try {
      setApprovingWETHToken(true)
      const transaction = await wethContract?.approve(
        collection === 'ewp'
          ? expansionsAddress.polygon
          : isTestnet
          ? weirdPunksAddress.mumbai
          : weirdPunksAddress.polygon,
        '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
      )
      setWETHApprovalTx(transaction.hash)
      await transaction.wait()
      setWETHApproved(true)
      setApprovingWETHToken(false)
    } catch (e) {
      console.log(e)
    }
  }
  const handleApproveWeirdToken = async () => {
    try {
      setApprovingWeirdToken(true)
      const transaction = await weirdContract?.approve(
        collection === 'ewp'
          ? expansionsAddress.polygon
          : isTestnet
          ? weirdPunksAddress.mumbai
          : weirdPunksAddress.polygon,
        '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
      )
      setWeirdApprovalTx(transaction.hash)
      await transaction.wait()
      setWeirdApproved(true)
      setApprovingWeirdToken(false)
    } catch (e) {
      const msg = getErrorMessage(e as ErrorMessage)
      setErrorMessage(msg)
      console.log(e)
    }
  }

  const handleBridge = async () => {
    try {
      setBridging(true)
      const bridgeIds = ids
        .split(', ')
        .map((i) => parseInt(i))
        .slice(0, 20)

      const gas = new ethers.Contract(
        gasCalculator.polygon,
        gasCalculatorAbi,
        signer
      )

      if (mainnetProvider && gas) {
        const oracleEthGas = await gas.gasETH()
        const contractGas = oracleEthGas.toNumber()
        const numberBridging = bridgeIds.length
        const contractGasTotal = (
          contractGas +
          (numberBridging - 1) * (contractGas / 2.5)
        ).toFixed(0)

        const ethGas =
          wethEstimate.toString() > contractGasTotal
            ? wethEstimate.toString()
            : contractGasTotal

        if (collection === 'wp') {
          const weirdPunks = new ethers.Contract(
            weirdPunksAddress.polygon,
            weirdPunksLayer2Abi,
            signer
          )
          const txn = await weirdPunks.batchBridge(bridgeIds, ethGas)
          setBridgeTx(txn.hash)
          await txn.wait()
          window.location.reload()
        } else if (collection === 'ewp') {
          const expansionWeirdPunks = new ethers.Contract(
            expansionsAddress.polygon,
            expansionsLayer2Abi,
            signer
          )
          const txn = await expansionWeirdPunks.batchBridge(bridgeIds, ethGas)
          setBridgeTx(txn.hash)
          await txn.wait()
          window.location.reload()
        }
      }

      setBridging(false)
    } catch (e) {
      const msg = getErrorMessage(e as ErrorMessage)
      setErrorMessage(msg)
      console.log(e)
    }
  }

  const handleCollectionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCollection(e.target.value)
  }

  return !address ? (
    <Button onClick={() => dispatch(startConnecting())}>
      Please connect your wallet
    </Button>
  ) : !isLayer2 ? (
    <Text>Please switch to {isTestnet ? 'Mumbai' : 'Polygon'}</Text>
  ) : (
    <Box>
      <Box m={20} p={5} backgroundColor={'#efefef'}>
        <Text>{welcome}</Text>
        <Select onChange={handleCollectionChange} value={collection}>
          <option value='wp'>Weird Punks</option>
          <option value='ewp'>Expansion Weird Punks</option>
        </Select>
      </Box>

      {bridgeComplete && (
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

      {!bridgeComplete && (
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
            <Text>Step 3. Bridge to Mainnet (batches of 20)</Text>
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
                  placeholder={
                    collection === 'wp'
                      ? 'Weird Punk IDs (comma separated)'
                      : 'Expansion Weird Punk IDs (comma separated)'
                  }
                  value={ids}
                  onChange={handleIds}
                />
                {weirdBridgeFee !== 999999 && (
                  <Text>
                    Bridge Fee: {ids.split(', ').length * weirdBridgeFee}
                    {' WEIRD (On Polygon)'}
                  </Text>
                )}
                {wethDisplay !== '' && (
                  <Text>Gas Fee: {wethDisplay} ETH (On Polygon)</Text>
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
