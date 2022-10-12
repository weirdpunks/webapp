import Heading from '@/components/UI/Heading'
import DisplayCard from '@/components/UI/DisplayCard'
import { auctionAbi } from '@/artifacts/auction'
import { erc20abi } from '@/artifacts/erc20'
import { startConnecting, useApp } from '@/components/Context'
import {
  Box,
  Button,
  Center,
  CircularProgress,
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
import { ExternalLinkIcon, RepeatIcon } from '@chakra-ui/icons'
import { ethers } from 'ethers'
import type { NextPage, InferGetStaticPropsType } from 'next'
import React, { useState, useEffect } from 'react'

const infuraId = process.env.NEXT_PUBLIC_INFURA_ID
const SECONDS_IN_DAY = 86400
const SECONDS_IN_HOUR = 3600
const SECONDS_IN_MINUTE = 60

type Data = {
  id: number
  startTimestamp: number
  endTimestamp: number
  startingBid: number
  highestBid: number
  bidderAddress: string
  bidderENS: string
}

interface AuctionProps {
  auction: Data
}

const AuctionPage: NextPage<AuctionProps> = ({
  auction
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { state, dispatch } = useApp()
  const { isTestnet, isLayer2, signer, address, weirdLayer2 } = state
  const {
    id,
    startTimestamp,
    endTimestamp,
    startingBid,
    highestBid,
    bidderAddress,
    bidderENS
  } = auction

  const [weirdApproved, setWeirdApproved] = useState(false)
  const [weirdContract, setWeirdContract] = useState<ethers.Contract>()
  const [weirdApprovalTx, setWeirdApprovalTx] = useState('')
  const [bidTx, setBidTx] = useState('')
  // const [claimTx, setClaimTx] = useState('')
  const [auctionContract, setAuctionContract] = useState<ethers.Contract>()
  const [upcomingAuction, setUpcomingAuction] = useState(false)
  const [auctionCompleted, setAuctionCompleted] = useState(false)
  const [minBid, setMinBid] = useState(0)
  const [days, setDays] = useState(0)
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [newBid, setNewBid] = useState(highestBid + 1)
  const [highBid, setHighBid] = useState(highestBid)
  const [highBidAddress, setHighBidAddress] = useState(bidderAddress)
  const [highBidENS, setHighBidENS] = useState(bidderENS)

  useEffect(() => {
    const getAuctionContract = async () => {
      const provider = new ethers.providers.JsonRpcProvider(
        `https://polygon-mainnet.infura.io/v3/${infuraId}`
      )
      const contract = new ethers.Contract(
        '0xeB60491dc3e129c58BEFd10062778821d082927F',
        auctionAbi,
        provider
      )
      setAuctionContract(contract)
    }
    if (id) {
      getAuctionContract()
    }
  }, [id])

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
    const loadWeirdContract = async () => {
      const erc20 = new ethers.Contract(
        '0xcB8BCDb991B45bF5D78000a0b5C0A6686cE43790',
        erc20abi,
        signer
      )
      const isWeirdApproved = await erc20.allowance(
        address,
        '0xeb60491dc3e129c58befd10062778821d082927f'
      )
      if (isWeirdApproved.toString() !== 0) {
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

  const getHighBid = async () => {
    try {
      if (id !== 0) {
        const newPriceBig = await auctionContract?.currentPrice(id)
        const newPrice = parseInt(ethers.utils.formatEther(newPriceBig))
        const bidderAddress = await auctionContract?.currentAddress(id)

        if (newPrice > highBid) {
          setHighBid(newPrice)
          if (bidderAddress !== '0xeB60491dc3e129c58BEFd10062778821d082927F') {
            if (bidderAddress !== highBidAddress) {
              setHighBidAddress(bidderAddress)
              const mainnetProvider = new ethers.providers.JsonRpcProvider(
                `https://mainnet.infura.io/v3/${infuraId}`
              )
              const bidderENS =
                (await mainnetProvider?.lookupAddress(bidderAddress)) || ''
              setHighBidENS(bidderENS)
            }
          }
          if (newBid < newPrice + 1) {
            setNewBid(newPrice + 1)
          }
          setMinBid(newPrice + 1)
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  const handleApproveWeirdToken = async () => {
    try {
      const transaction = await weirdContract?.approve(
        '0xeb60491dc3e129c58befd10062778821d082927f',
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
      const contract = new ethers.Contract(
        '0xeB60491dc3e129c58BEFd10062778821d082927F',
        auctionAbi,
        signer
      )
      const transaction = await contract?.bid(
        id,
        ethers.utils.parseEther(`${newBid}`)
      )
      setBidTx(transaction.hash)
      await transaction.wait()
      await getHighBid()
    } catch (e) {
      console.log(e)
    }
  }

  // const handleClaim = async () => {
  //   try {
  //     const transaction = await auctionContract?.finalize(id)
  //     setClaimTx(transaction.hash)
  //     await transaction.wait()
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }

  const handleUpdateBid = (num: string) => {
    setNewBid(parseInt(num))
  }

  return (
    <Box>
      <Heading>Auction</Heading>
      <Box>
        <Center py={6}>
          <Stack direction={'column'} align={'center'} justify={'center'}>
            <Box p={4} m={2} textAlign='center'>
              <>
                {!id ? (
                  <Text>Loading...</Text>
                ) : id === 0 ? (
                  <Text>{`We don't have any auctions running at the moment.`}</Text>
                ) : (
                  <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={12}>
                    <Box>
                      <DisplayCard id={id} />
                    </Box>
                    <Box textAlign={'center'}>
                      <Text fontSize={'xl'} mt={12} fontWeight={'bold'}>
                        Expansion Weird Punk #{id}
                      </Text>
                      <Text fontSize={'lg'}>
                        {upcomingAuction
                          ? 'Auction begins soon.'
                          : auctionCompleted
                          ? 'auction ended.'
                          : days > 0
                          ? `${days} Day${days > 1 && 's'} ${hours}:${
                              minutes < 10 ? '0' : ''
                            }${minutes}:${
                              seconds < 10 ? `0${seconds}` : seconds
                            }`
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
                      <Box p={2} textAlign={'center'} mx={'auto'}>
                        <Button onClick={() => getHighBid()} size='xs'>
                          <RepeatIcon mx='2px' />
                        </Button>
                        {highestBid > 0 && (
                          <>
                            <Text>Highest Bid: {highBid} WEIRD</Text>
                            {highBidAddress !== '' && highBid > 0 && (
                              <Text>
                                Bidder:{' '}
                                {highBidENS !== ''
                                  ? highBidENS
                                  : getEllipsisTxt(highBidAddress)}
                              </Text>
                            )}
                          </>
                        )}
                        {highestBid < startingBid && (
                          <Text>Starting Price: {startingBid} WEIRD</Text>
                        )}
                        {/* <>
                          {auctionCompleted && bidderAddress === address && (
                            <>
                              <Button onClick={handleClaim}>Claim</Button>
                              {claimTx !== '' && (
                                <Box p={4}>
                                  <Link
                                    href={`https://polygonscan.com/tx/${claimTx}`}
                                    isExternal={true}>
                                    View transaction{' '}
                                    <ExternalLinkIcon mx='2px' />
                                  </Link>
                                </Box>
                              )}
                            </>
                          )}
                        </> */}
                        <>
                          {!auctionCompleted && (
                            <Box mt={4}>
                              {!address ? (
                                <Button
                                  onClick={() => dispatch(startConnecting())}>
                                  Please connect your wallet to bid
                                </Button>
                              ) : !isLayer2 || isTestnet ? (
                                <Text>Please switch to Polygon to bid</Text>
                              ) : (
                                <>
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
                                              <Button
                                                onClick={
                                                  handleApproveWeirdToken
                                                }>
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
                                              View transaction{' '}
                                              <ExternalLinkIcon mx='2px' />
                                            </Link>
                                          </Box>
                                        )}
                                      </Box>
                                    )}
                                  </>
                                  <NumberInput
                                    min={minBid}
                                    max={weirdLayer2}
                                    isDisabled={!weirdApproved}
                                    maxW='100px'
                                    mr='2rem'
                                    value={newBid}
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
                                    disabled={
                                      !weirdApproved ||
                                      newBid < highestBid + 1 ||
                                      highestBid > weirdLayer2
                                    }>
                                    Place Bid
                                  </Button>
                                  {highestBid > weirdLayer2 && (
                                    <Text>
                                      Highest bid exceeds your Weird balance.
                                    </Text>
                                  )}
                                </>
                              )}
                            </Box>
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
    </Box>
  )
}

const getStaticProps = async () => {
  const provider = new ethers.providers.JsonRpcProvider(
    `https://polygon-mainnet.infura.io/v3/${infuraId}`
  )
  const contract = new ethers.Contract(
    '0xeB60491dc3e129c58BEFd10062778821d082927F',
    auctionAbi,
    provider
  )
  const allAuctions = await contract.getAllLiveAuctions()
  const id = await allAuctions[0].toNumber()
  const startTimestamp = await contract?.timestampStarted(id)
  const endTimestamp = await contract?.timestampFinished(id)
  const startingBidBig = await contract?.startPrice(id)
  const startingBid = parseInt(ethers.utils.formatEther(startingBidBig))
  const bidderAddress = (await contract?.currentAddress(id)) || ''
  const bidBig = await contract?.currentPrice(id)
  const highestBid = parseInt(ethers.utils.formatEther(bidBig))
  let bidderENS = ''
  if (bidderAddress !== '') {
    const mainnetProvider = new ethers.providers.JsonRpcProvider(
      `https://mainnet.infura.io/v3/${infuraId}`
    )
    bidderENS = (await mainnetProvider?.lookupAddress(bidderAddress)) || ''
  }
  const auction: Data = {
    id,
    startTimestamp: startTimestamp.toNumber(),
    endTimestamp: endTimestamp.toNumber(),
    startingBid,
    highestBid,
    bidderAddress,
    bidderENS
  }
  return {
    props: {
      auction
    }
  }
}

export { getStaticProps }

export default AuctionPage
