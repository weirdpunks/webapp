import DisplayCard from '@/components/UI/DisplayCard'
import Timer from '@/components/UI/Timer'
import { auctionAbi } from '@/artifacts/auction'
import { erc20abi } from '@/artifacts/erc20'
import { claimed, startConnecting, useApp } from '@/components/Context'
import { weird, auction } from '@/utils/contracts'
import {
  Box,
  Button,
  Center,
  CircularProgress,
  Flex,
  Heading,
  HStack,
  Icon,
  Link,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  SimpleGrid,
  Stack,
  Text,
  UseNumberInputReturn
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { FaCheckCircle } from 'react-icons/fa'
import { ethers } from 'ethers'
import Image from 'next/image'
import React, { useState, useEffect, useCallback } from 'react'

const infuraId = process.env.NEXT_PUBLIC_INFURA_ID

interface AuctionInfo {
  expansionId: number
  start: number
  end: number
  startPrice: number
}

const Auction = () => {
  const { state, dispatch } = useApp()
  const { isTestnet, isLayer2, signer, address, weirdLayer2 } = state

  const [loading, setIsLoading] = useState(true)
  const [weirdApproved, setWeirdApproved] = useState(false)
  const [weirdContract, setWeirdContract] = useState<ethers.Contract>()
  const [weirdApprovalTx, setWeirdApprovalTx] = useState('')
  const [bidTx, setBidTx] = useState('')
  const [auctionContract, setAuctionContract] = useState<ethers.Contract>()
  const [openAuctions, setOpenAuctions] = useState<AuctionInfo[]>([])
  const [auctionId, setAuctionId] = useState<number | null>(null)
  const [expansionId, setExpansionId] = useState(0)
  const [startTimestamp, setStartTimestamp] = useState(0)
  const [endTimestamp, setEndTimestamp] = useState(0)
  const [startPrice, setStartPrice] = useState(0)
  const [price, setPrice] = useState(0)
  const [minBid, setMinBid] = useState(0)
  const [bid, setBid] = useState(0)

  useEffect(() => {
    const getAuctions = async () => {
      const contract = new ethers.Contract(auction.polygon, auctionAbi, signer)
      const allAuctions = await contract.getAllLiveAuctions()
      const auctions = []
      for (let i = 0; i < allAuctions.length; i++) {
        const expansionId = allAuctions[i].toNumber()
        const start = await contract.timestampStarted(expansionId)
        const end = await contract.timestampFinished(expansionId)
        const startPriceBig = await contract.startPrice(expansionId)
        const startPrice = parseInt(ethers.utils.formatEther(startPriceBig))
        auctions.push({
          expansionId,
          start,
          end,
          startPrice
        })
      }
      if (auctions.length) {
        setOpenAuctions(auctions)
        setExpansionId(auctions[0].expansionId)
        setStartTimestamp(auctions[0].start)
        setEndTimestamp(auctions[0].end)
        setStartPrice(auctions[0].startPrice)
        setMinBid(auctions[0].startPrice)
        setBid(auctions[0].startPrice)
      }
      setIsLoading(false)
      setAuctionContract(contract)
    }
    if (
      address !== '' &&
      !isTestnet &&
      isLayer2 &&
      auctionContract === undefined
    ) {
      getAuctions()
    }
  }, [address, signer, isTestnet, isLayer2, auctionContract])

  useEffect(() => {
    const getCurrentAuction = async () => {}

    if (auctionId !== 0 && auctionContract) {
    }
  }, [auctionId, auctionContract])

  useEffect(() => {
    const loadWeirdContract = async () => {
      const erc20 = new ethers.Contract(weird.polygon, erc20abi, signer)
      const isWeirdApproved = await erc20.allowance(address, auction.polygon)
      if (
        isWeirdApproved &&
        isWeirdApproved._hex ===
          '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
      ) {
        setWeirdApproved(true)
      }
      setWeirdContract(erc20)
    }
    if (
      !isTestnet &&
      isLayer2 &&
      address !== '' &&
      weirdContract === undefined
    ) {
      loadWeirdContract()
    }
  }, [isLayer2, isTestnet, weirdContract, address, signer])

  const getLatestPrice = useCallback(async () => {
    try {
      if (expansionId !== 0) {
        const newPrice = await auctionContract?.currentPrice(expansionId)
        setPrice(parseInt(ethers.utils.formatUnits(newPrice, 'ethers')))
      }
    } catch (e) {
      console.log(e)
    }
  }, [auctionContract, expansionId])

  useEffect(() => {
    let myInterval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000)
      if (endTimestamp <= now && startTimestamp >= now) {
        getLatestPrice()
      } else {
        clearInterval(myInterval)
      }
    }, 10000)
    return () => {
      clearInterval(myInterval)
    }
  }, [getLatestPrice, startTimestamp, endTimestamp])

  const handleApproveWeirdToken = async () => {
    try {
      const transaction = await weirdContract?.approve(
        auction.polygon,
        '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
      )
      setWeirdApprovalTx(transaction.hash)
      await transaction.wait()
      setWeirdApproved(true)
    } catch (e) {
      console.log(e)
    }
  }

  const handleBid = async () => {
    try {
      const transaction = await auctionContract?.bid(
        expansionId,
        ethers.utils.parseEther(`${bid}`)
      )
      setBidTx(transaction.hash)
      await transaction.wait()
      getLatestPrice()
    } catch (e) {
      console.log(e)
    }
  }

  const handleUpdateBid = (num: string) => {
    setBid(parseInt(num))
  }

  return !address ? (
    <Button onClick={() => dispatch(startConnecting())}>
      Please connect your wallet
    </Button>
  ) : !isLayer2 || isTestnet ? (
    <Text>Please switch to Polygon</Text>
  ) : (
    <Box>
      <Center py={6}>
        <Stack direction={'column'} align={'center'} justify={'center'}>
          <Box p={4} m={2} textAlign='center'>
            <>
              {expansionId === 0 ? (
                <Text>{`We don't have any auctions running at the moment.`}</Text>
              ) : (
                <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={12}>
                  <Box>
                    <DisplayCard id={expansionId} />
                  </Box>
                  <Box textAlign={'center'}>
                    <Text fontSize={'xl'}>
                      Expansion Weird Punk #{expansionId}
                    </Text>
                    <Text fontSize={'lg'}>
                      Auction end: <Timer timestamp={endTimestamp as number} />
                    </Text>
                    <Box p={2}>
                      <Text>Step 1. Approve WEIRD</Text>
                      {weirdContract === undefined ? (
                        <CircularProgress
                          size={'32px'}
                          isIndeterminate
                          color='green.300'
                        />
                      ) : (
                        <>
                          {!weirdApproved ? (
                            <>
                              {weirdApprovalTx !== '' ? (
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
                            href={`https://polygonscan.com/tx/${weirdApprovalTx}`}
                            isExternal={true}>
                            View transaction <ExternalLinkIcon mx='2px' />
                          </Link>
                        </Box>
                      )}
                    </Box>
                    <Box p={2} textAlign={'center'} mx={'auto'}>
                      <>
                        {startPrice <= price && (
                          <Text>Highest Bid: {price} WEIRD</Text>
                        )}
                        {startPrice > price && (
                          <Text>Starting Price: {startPrice} WEIRD</Text>
                        )}
                      </>
                      <NumberInput
                        min={minBid}
                        isDisabled={!weirdApproved}
                        maxW='100px'
                        mr='2rem'
                        value={bid}
                        textAlign={'center'}
                        mx={'auto'}
                        my={2}
                        onChange={handleUpdateBid}>
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <Button
                        onClick={handleBid}
                        disabled={!weirdApproved || bid < price + 1}>
                        Place Bid
                      </Button>
                      {bidTx !== '' && (
                        <Box p={4}>
                          <Link
                            href={`https://polygonscan.com/tx/${bidTx}`}
                            isExternal={true}>
                            View transaction <ExternalLinkIcon mx='2px' />
                          </Link>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </SimpleGrid>
              )}
            </>
          </Box>
        </Stack>
      </Center>
    </Box>
  )
}

export default Auction
