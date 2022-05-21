import { claimAbi } from '@/artifacts/claim'
import { claimed, useApp } from '@/components/Context'
import { weirdClaim } from '@/utils/contracts'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Center,
  CircularProgress,
  Link,
  Stack,
  Text
} from '@chakra-ui/react'
import { ethers } from 'ethers'
import Image from 'next/image'
import { useState, useEffect } from 'react'

const infuraId = process.env.NEXT_PUBLIC_INFURA_ID

const Claim = () => {
  const { state, dispatch } = useApp()
  const {
    unclaimed,
    isTestnet,
    isLayer2,
    signer,
    weirdPunksMainnet,
    weirdPunksLayer2
  } = state

  const [tx, setTx] = useState('')
  const [isClaiming, setIsClaiming] = useState(false)
  const [initialClaim, setInitialClaim] = useState(false)

  useEffect(() => {
    const checkPreviousClaim = async () => {
      try {
        const provider = new ethers.providers.JsonRpcProvider(
          `https://polygon-mainnet.infura.io/v3/${infuraId}`
        )
        const claim = new ethers.Contract(
          weirdClaim.polygon,
          claimAbi,
          provider
        )
        await claim.claimableForIDs(weirdPunksMainnet)
      } catch (_e) {
        setInitialClaim(true)
      }
    }
    if (
      !isTestnet &&
      weirdPunksLayer2.length === 0 &&
      weirdPunksMainnet.length > 0
    ) {
      // mainnet weird punks only
      checkPreviousClaim()
    }
  }, [weirdPunksLayer2, weirdPunksMainnet, isTestnet])

  const handleClaim = async () => {
    try {
      setIsClaiming(true)
      const contract = isTestnet ? weirdClaim.mumbai : weirdClaim.polygon
      const claim = new ethers.Contract(contract, claimAbi, signer)
      const gas = await claim.estimateGas.claim()
      const gasFormat = ethers.utils.formatUnits(gas, 'wei')
      var overrideOptions = {
        gasLimit: gasFormat
      }
      const transaction = await claim.claim(overrideOptions)
      setTx(transaction.hash)
      await transaction.wait()
      setIsClaiming(false)
      dispatch(claimed())
    } catch (e) {
      console.log(JSON.stringify(e))
    }
  }

  return (
    <Box>
      <Center py={6}>
        <Stack direction={'column'} align={'center'} justify={'center'}>
          <Stack direction={'row'} align={'center'} justify={'center'}>
            <Image
              src='/icons/aWeirdTokenPolygon.png'
              width={34}
              height={34}
              alt='$WEIRD'
            />
            <Text fontSize={'xl'} fontWeight={600}>
              {initialClaim
                ? 'Please initialize your claim.'
                : `${unclaimed} Unclaimed`}
            </Text>
          </Stack>
          <Box p={4} m={2} textAlign='center'>
            {isLayer2 ? (
              <>
                {isClaiming ? (
                  <CircularProgress
                    size={'32px'}
                    isIndeterminate
                    color='green.300'
                  />
                ) : (
                  <Button
                    onClick={handleClaim}
                    disabled={Boolean(
                      !isTestnet && unclaimed < 1 && !initialClaim
                    )}>
                    Claim
                  </Button>
                )}
              </>
            ) : (
              <Text>
                Please switch to {isTestnet ? 'Mumbai' : 'Polygon'} to claim
              </Text>
            )}
            <Text>
              Each Weird Punk earns 1 WEIRD token per day. Come back anytime you
              have 1+ to claim.
            </Text>
          </Box>
          {tx !== '' && (
            <Box p={4}>
              <Link
                href={`${
                  isTestnet
                    ? 'https://mumbai.polygonscan.com/tx/'
                    : 'https://polygonscan.com/tx/'
                }${tx}`}
                isExternal={true}>
                View transaction <ExternalLinkIcon mx='2px' />
              </Link>
            </Box>
          )}
        </Stack>
      </Center>
    </Box>
  )
}

export default Claim
