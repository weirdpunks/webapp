import { useApp } from './Context/Index'
import { weird } from '../utils/contracts'
import { chains } from '../utils/chains'
import { erc20abi } from '../artifacts/erc20'
import { ethers } from 'ethers'
import { Box, Heading, Flex } from '@chakra-ui/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const WeirdTokens = () => {
  const { state, dispatch } = useApp()
  const { address, provider, chain } = state

  const [balance, setBalance] = useState<number>(0)

  useEffect(() => {
    const getBalance = async () => {
      const currChain = await chains.find((i) => i.id === chain)
      let contract = ''
      switch (currChain?.id) {
        case 'mainnet':
          contract = weird.mainnet
          break
        case 'polygon':
          contract = weird.polygon
          break
        case 'goerli':
          contract = weird.goerli
          break
        case 'mumbai':
          contract = weird.mumbai
          break
        default:
          break
      }
      if (contract !== '') {
        const weirdContract = new ethers.Contract(contract, erc20abi, provider)

        const weirdBalance = await weirdContract.balanceOf(`${address}`)
        if (weirdBalance) {
          const rounded = Math.floor(
            parseFloat(ethers.utils.formatUnits(weirdBalance, 18))
          )
          setBalance(rounded)
        }
      }
    }
    if (provider && chain && address !== '') {
      getBalance()
    }
  }, [provider, address, chain])

  return (
    <Box textAlign='center' py={10} px={6}>
      <Box display='inline-block'>
        <Flex
          flexDirection='column'
          justifyContent='center'
          alignItems='center'
          rounded={'50px'}
          w={'34px'}
          h={'34px'}
          textAlign='center'>
          <Image
            src='/icons/weirdTokenPolygon.png'
            width={34}
            height={34}
            alt='$WEIRD'
          />
        </Flex>
      </Box>

      <Heading as='h2' size='xl' mt={6} mb={2}>
        Weird Tokens: {balance}{' '}
      </Heading>
    </Box>
  )
}

export default WeirdTokens
