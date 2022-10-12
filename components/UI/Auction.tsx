import DisplayCard from '@/components/UI/DisplayCard'
import { auctionAbi } from '@/artifacts/auction'
import { erc20abi } from '@/artifacts/erc20'
import { startConnecting, useApp } from '@/components/Context'
import { weird, auction } from '@/utils/contracts'
import {
  Box,
  Button,
  Center,
  CircularProgress,
  Flex,
  Icon,
  Link,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  SimpleGrid,
  Stack,
  Text
} from '@chakra-ui/react'
import { getEllipsisTxt } from '@/utils/formatters'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { FaCheckCircle } from 'react-icons/fa'
import { ethers } from 'ethers'
import React, { useState, useEffect, useCallback } from 'react'

const infuraId = process.env.NEXT_PUBLIC_INFURA_ID
const SECONDS_IN_DAY = 86400
const SECONDS_IN_HOUR = 3600
const SECONDS_IN_MINUTE = 60

interface AuctionInfo {
  expansionId: number
  start: number
  end: number
  startPrice: number
}

const Auction = () => {
  const { state, dispatch } = useApp()
  const { isTestnet, isLayer2, signer, address, weirdLayer2 } = state

  const [weirdApproved, setWeirdApproved] = useState(false)
  const [weirdContract, setWeirdContract] = useState<ethers.Contract>()
  const [weirdApprovalTx, setWeirdApprovalTx] = useState('')
  const [bidTx, setBidTx] = useState('')
  const [claimTx, setClaimTx] = useState('')
  const [auctionContract, setAuctionContract] = useState<ethers.Contract>()
  const [openAuctions, setOpenAuctions] = useState<AuctionInfo[]>([])
  const [auctionId, setAuctionId] = useState<number | null>(null)
  const [expansionId, setExpansionId] = useState(0)
  const [startTimestamp, setStartTimestamp] = useState(0)
  const [endTimestamp, setEndTimestamp] = useState(0)
  const [upcomingAuction, setUpcomingAuction] = useState(false)
  const [auctionCompleted, setAuctionCompleted] = useState(false)
  const [startPrice, setStartPrice] = useState(0)
  const [price, setPrice] = useState(0)
  const [minBid, setMinBid] = useState(0)
  const [bid, setBid] = useState(0)
  const [auctionStatus, setAuctionStatus] = useState('')
  const [highBidderAddress, setHighBidderAddress] = useState('')
  const [highBidderENS, setHighBidderENS] = useState('')
  const [mainnetProvider, setMainnetProvider] =
    useState<ethers.providers.JsonRpcProvider>()
  const [days, setDays] = useState(0)
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const setupTimer = () => {
      const now = Math.floor(Date.now() / 1000)
      let secondsLeft = endTimestamp - now
      if (startTimestamp > now) {
        setUpcomingAuction(true)
      } else if (secondsLeft > 0) {
        const numDays = Math.floor(secondsLeft / SECONDS_IN_DAY)
        secondsLeft -= numDays * SECONDS_IN_DAY
        const numHours = Math.floor(secondsLeft / SECONDS_IN_HOUR)
        secondsLeft -= numHours * SECONDS_IN_HOUR
        const numMinutes = Math.floor(secondsLeft / SECONDS_IN_MINUTE)
        secondsLeft -= numMinutes * SECONDS_IN_MINUTE
        setDays(numDays)
        setHours(numHours)
        setMinutes(numMinutes)
        setSeconds(secondsLeft)
      } else {
        setAuctionCompleted(true)
      }
    }

    if (startTimestamp !== 0 && endTimestamp !== 0) {
      setupTimer()
    }
  }, [startTimestamp, endTimestamp])

  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds === 0) {
        if (minutes === 0) {
          if (hours === 0) {
            if (days === 0) {
              clearInterval(myInterval)
            } else {
              setDays(days - 1)
              setHours(23)
              setMinutes(59)
              setSeconds(59)
            }
          } else {
            setHours(hours - 1)
            setMinutes(59)
            setSeconds(59)
          }
        } else {
          setMinutes(minutes - 1)
          setSeconds(59)
        }
      } else {
        setSeconds(seconds - 1)
      }
    }, 1000)
    return () => {
      clearInterval(myInterval)
    }
  })

  useEffect(() => {
    if (mainnetProvider === undefined) {
      setMainnetProvider(
        new ethers.providers.JsonRpcProvider(
          `https://mainnet.infura.io/v3/${infuraId}`
        )
      )
    }
  }, [mainnetProvider])

  useEffect(() => {
    const attemptENS = async () => {
      const ensName = await mainnetProvider?.lookupAddress(highBidderAddress)
      if (ensName && ensName !== '') {
        setHighBidderENS(ensName)
      }
    }
    if (highBidderAddress !== '' && mainnetProvider) {
      attemptENS()
    }
  }, [highBidderAddress, mainnetProvider])

  useEffect(() => {
    const getAuctions = async () => {
      const contract = new ethers.Contract(auction.polygon, auctionAbi, signer)
      const allAuctions = await contract.getAllLiveAuctions()
      const auctions = []
      for (let i = 0; i < allAuctions.length; i++) {
        const expansionId = allAuctions[i].toNumber()
        auctions.push(expansionId)
      }
      if (auctions.length) {
        setExpansionId(auctions[0])
      }
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
    const getCurrentAuction = async () => {
      const start = await auctionContract?.timestampStarted(expansionId)
      const end = await auctionContract?.timestampFinished(expansionId)
      const startPriceBig = await auctionContract?.startPrice(expansionId)
      const startPrice = parseInt(ethers.utils.formatEther(startPriceBig))
      const currentAddress = await auctionContract?.currentAddress(expansionId)
      const currentPriceBig = await auctionContract?.currentPrice(expansionId)
      const currentPrice = parseInt(ethers.utils.formatEther(currentPriceBig))
      setStartTimestamp(start)
      setEndTimestamp(end)
      setStartPrice(startPrice)
      setMinBid(currentPrice >= startPrice ? currentPrice + 1 : startPrice)
      setBid(startPrice)
      setHighBidderENS('')
      setHighBidderAddress(
        currentPrice !== 0 && currentPrice >= startPrice ? currentAddress : ''
      )
    }

    if (expansionId !== 0 && auctionContract) {
      getCurrentAuction()
    }
  }, [expansionId, auctionContract])

  useEffect(() => {
    const loadWeirdContract = async () => {
      const erc20 = new ethers.Contract(weird.polygon, erc20abi, signer)
      const isWeirdApprovedBig = await erc20.allowance(address, auction.polygon)
      const isWeirdApproved = parseInt(
        ethers.utils.formatEther(isWeirdApprovedBig)
      )
      if (isWeirdApproved !== 0) {
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

  const getLatest = useCallback(async () => {
    try {
      if (expansionId !== 0) {
        const newPriceBig = await auctionContract?.currentPrice(expansionId)
        const newPrice = parseInt(ethers.utils.formatEther(newPriceBig))
        const bidderAddress = await auctionContract?.currentAddress(expansionId)

        if (newPrice > price) {
          setPrice(newPrice)
          if (bidderAddress !== highBidderAddress) {
            setHighBidderAddress(bidderAddress)
          }
          if (bid < newPrice + 1) {
            setBid(newPrice + 1)
          }
          setMinBid(newPrice + 1)
        }
      }
    } catch (e) {
      console.log(e)
    }
  }, [auctionContract, expansionId, bid, price, highBidderAddress])

  useEffect(() => {
    let myInterval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000)
      if (endTimestamp >= now && startTimestamp <= now) {
        getLatest()
      } else {
        clearInterval(myInterval)
      }
    }, 10000)
    return () => {
      clearInterval(myInterval)
    }
  }, [getLatest, startTimestamp, endTimestamp])

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
      getLatest()
    } catch (e) {
      console.log(e)
    }
  }

  const handleClaim = async () => {
    try {
      const transaction = await auctionContract?.finalize(expansionId)
      setClaimTx(transaction.hash)
      await transaction.wait()
    } catch (e) {
      console.log(e)
    }
  }

  const handleUpdateBid = (num: string) => {
    setBid(parseInt(num))
  }

  return (
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
                    <Text fontSize={'xl'} mt={12} fontWeight={'bold'}>
                      Expansion Weird Punk #{expansionId}
                    </Text>
                    <Text fontSize={'lg'}>
                      {upcomingAuction
                        ? 'Auction begins soon.'
                        : auctionCompleted
                        ? 'Auction ended.'
                        : days > 0
                        ? `${days} Day${days > 1 && 's'} ${hours}:${
                            minutes < 10 ? '0' : ''
                          }${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
                        : hours > 0
                        ? `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${
                            seconds < 10 ? `0${seconds}` : seconds
                          }`
                        : minutes > 0
                        ? `${minutes < 10 ? '0' : ''}${minutes}:${
                            seconds < 10 ? `0${seconds}` : seconds
                          }`
                        : seconds > 0
                        ? `:${seconds < 10 ? '0' : ''}${seconds}`
                        : 'Ended'}
                    </Text>
                    <>
                      {!weirdApproved && (
                        <Box p={2}>
                          <Text>Approve WEIRD</Text>
                          {weirdContract === undefined ? (
                            <CircularProgress
                              size={'32px'}
                              isIndeterminate
                              color='green.300'
                            />
                          ) : (
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
                      )}
                    </>
                    <Box p={2} textAlign={'center'} mx={'auto'}>
                      <>
                        {startPrice <= price && (
                          <>
                            <Text>Highest Bid: {price} WEIRD</Text>
                            {highBidderAddress !== '' && price > 0 && (
                              <Text>
                                Bidder:{' '}
                                {highBidderENS !== ''
                                  ? highBidderENS
                                  : getEllipsisTxt(highBidderAddress)}
                              </Text>
                            )}
                          </>
                        )}
                        {startPrice > price && (
                          <Text>Starting Price: {startPrice} WEIRD</Text>
                        )}
                      </>
                      <>
                        {auctionCompleted && highBidderAddress === address && (
                          <>
                            <Button onClick={handleClaim}>Claim</Button>
                            {claimTx !== '' && (
                              <Box p={4}>
                                <Link
                                  href={`https://polygonscan.com/tx/${claimTx}`}
                                  isExternal={true}>
                                  View transaction <ExternalLinkIcon mx='2px' />
                                </Link>
                              </Box>
                            )}
                          </>
                        )}
                      </>
                      <>
                        {!auctionCompleted && (
                          <>
                            {!address ? (
                              <Button
                                onClick={() => dispatch(startConnecting())}>
                                Please connect your wallet to bid
                              </Button>
                            ) : !isLayer2 || isTestnet ? (
                              <Text>Please switch to Polygon to bid</Text>
                            ) : (
                              <>
                                <NumberInput
                                  min={minBid}
                                  max={weirdLayer2}
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
                              </>
                            )}
                          </>
                        )}
                        {bidTx !== '' && (
                          <Box p={4}>
                            <Link
                              href={`https://polygonscan.com/tx/${bidTx}`}
                              isExternal={true}>
                              View transaction <ExternalLinkIcon mx='2px' />
                            </Link>
                          </Box>
                        )}
                      </>
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
