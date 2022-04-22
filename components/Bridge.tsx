import { weirdPunksLayer2Abi } from '@/artifacts/weirdPunksLayer2'
import { weirdPunksMainnetAbi } from '@/artifacts/weirdPunksMainnet'
import { erc20abi } from '@/artifacts/erc20'
import { useApp } from '@/components/Context'
import { weirdPunks, weth, weird } from '@/utils/contracts'
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
import { useEffect, useState, ChangeEvent } from 'react'

const infuraId = process.env.NEXT_PUBLIC_INFURA_ID

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
        isTestnet ? weirdPunks.mumbai : weirdPunks.polygon,
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
        setWeirdBridgeFee(fee.toNumber())
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
        isTestnet ? weirdPunks.mumbai : weirdPunks.polygon
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
        isTestnet ? weirdPunks.mumbai : weirdPunks.polygon
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

  const handleWETHApprove = async () => {
    try {
      setApprovingWETHToken(true)
      const transaction = await wethContract?.approve(
        isTestnet ? weirdPunks.mumbai : weirdPunks.polygon,
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
        isTestnet ? weirdPunks.mumbai : weirdPunks.polygon,
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

      const l2Contract = isTestnet ? weirdPunks.mumbai : weirdPunks.polygon
      const mainnetContract = isTestnet
        ? weirdPunks.rinkeby
        : weirdPunks.mainnet

      const wpL2 = new ethers.Contract(l2Contract, weirdPunksLayer2Abi, signer)

      const wpMain = new ethers.Contract(
        mainnetContract,
        weirdPunksMainnetAbi,
        mainnetProvider
      )
      // const mainnetGas = await wpMain.estimateGas.depositBridge(
      //   address,
      //   bridgeIds
      // )
      // const gasPrice = await mainnetProvider?.getGasPrice()
      // const price = gasPrice ? gasPrice.toString() : ''
      // const gasFormat = parseInt(ethers.utils.formatUnits(mainnetGas, 'wei'))
      // const priceFormat = parseInt(ethers.utils.formatUnits(price, 'wei')) * 1.1
      // const gas1 = ethers.utils.formatEther(gasFormat * priceFormat) || 0

      const gas2 = await wpL2.gasETH()
      // console.log(gas2)
      // const gas = gas1 > gas2 ? gas1 : gas2
      const txn = wpL2.batchBridge(bridgeIds, gas2, {
        gasLimit: 6000000,
        gasPrice: ethers.utils.parseUnits('30.0', 'gwei')
      })
      setBridgeTx(txn.hash)
      await txn.wait()
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
