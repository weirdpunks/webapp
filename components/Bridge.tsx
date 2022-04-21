import { weirdPunksLayer2Abi } from '@/artifacts/weirdPunksLayer2'
import { weirdPunksMainnetAbi } from '@/artifacts/weirdPunksMainnet'
import { erc20abi } from '@/artifacts/erc20'
import { useApp } from '@/components/Context'
import { weirdPunks, weth } from '@/utils/contracts'
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
  const { state, dispatch } = useApp()
  const { chainId, signer, address, isLayer2, isTestnet, weirdPunksLayer2 } =
    state

  const [ids, setIds] = useState('')
  const [mainnetProvider, setMainnetProvider] =
    useState<ethers.providers.JsonRpcProvider>()
  const [wethApproved, setWETHApproved] = useState(false)
  const [checkingApproval, setCheckingApproval] = useState(false)
  const [changingApproval, setChangingApproval] = useState(false)
  const [approvalTx, setApprovalTx] = useState('')
  const [blockExplorer, setBlockExplorer] = useState('')
  const [bridgeTx, setBridgeTx] = useState('')
  const [bridging, setBridging] = useState(false)

  useEffect(() => {
    setIds(weirdPunksLayer2.join(', '))
  }, [weirdPunksLayer2])

  useEffect(() => {
    if (isTestnet) {
      setMainnetProvider(
        new ethers.providers.JsonRpcProvider(
          `https://rinkeby.infura.io/v3/${infuraId}`
        )
      )
    } else {
      setMainnetProvider(
        new ethers.providers.JsonRpcProvider(
          `https://mainnet.infura.io/v3/${infuraId}`
        )
      )
    }
  }, [isTestnet])

  const welcome = isTestnet
    ? 'Bridge from Mumbai to Rinkeby'
    : 'Bridge from Polygon to Ethereum'

  const handleIds = (e: ChangeEvent<HTMLInputElement>) => {
    setIds(e.target.value)
  }

  useEffect(() => {
    const checkApproval = async () => {
      try {
        const token = isTestnet ? weth.mumbai : weth.polygon
        const nft = isTestnet ? weirdPunks.mumbai : weirdPunks.polygon
        const layer2Eth = new ethers.Contract(token, erc20abi, signer)
        const approvalTrans = await layer2Eth.allowance(address, nft)
        if (approvalTrans !== ethers.BigNumber.from(0)) {
          setWETHApproved(true)
        }
        setCheckingApproval(false)
      } catch (e) {
        console.log(e)
        setCheckingApproval(false)
      }
    }
    if (isLayer2) {
      checkApproval()
    }
  }, [address, isLayer2, isTestnet, signer])

  const handleWETHApprove = async () => {
    try {
      setChangingApproval(true)
      const token = isTestnet ? weth.mumbai : weth.polygon
      const nft = isTestnet ? weirdPunks.mumbai : weirdPunks.polygon

      const layer2Eth = new ethers.Contract(token, erc20abi, signer)
      const transaction = await layer2Eth.approve(
        nft,
        '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
      )
      setApprovalTx(transaction.hash)
      await transaction.wait()
      setChangingApproval(false)
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
      const mainnetGas = await wpMain.estimateGas.depositBridge(
        address,
        bridgeIds
      )
      console.log(mainnetGas)
      const gasPrice = await mainnetProvider?.getGasPrice()
      console.log(gasPrice)
      const price = gasPrice ? gasPrice.toString() : ''
      const gasFormat = parseInt(ethers.utils.formatUnits(mainnetGas, 'wei'))
      const priceFormat = parseInt(ethers.utils.formatUnits(price, 'wei')) * 1.1
      const gas1 = ethers.utils.formatEther(gasFormat * priceFormat)

      const gas2 = await wpL2.gasETH()
      console.log(gas2)
      const gas = gas1 > gas2 ? gas1 : gas2
      const txn = wpL2.batchBridge(bridgeIds.join(', '), gas)
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
              <Link href={`${blockExplorer}${bridgeTx}`} isExternal={true}>
                View transaction <ExternalLinkIcon mx='2px' />
              </Link>
            </AlertDescription>
          </Box>
        </Alert>
      )}

      {weirdPunksLayer2 && weirdPunksLayer2.length > 0 && (
        <>
          <Box>
            <Text>Step 1. Approve WETH</Text>
            {checkingApproval ? (
              <CircularProgress
                size={'32px'}
                isIndeterminate
                color='green.300'
              />
            ) : (
              <>
                {!wethApproved ? (
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
            {approvalTx !== '' && (
              <Box p={4}>
                <Link href={`${blockExplorer}${approvalTx}`} isExternal={true}>
                  View transaction <ExternalLinkIcon mx='2px' />
                </Link>
              </Box>
            )}
          </Box>
          <Box mx={5} my={10}>
            <Text>Step 2. Bridge to Mainnet</Text>
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
                <Link href={`${blockExplorer}${bridgeTx}`} isExternal={true}>
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
