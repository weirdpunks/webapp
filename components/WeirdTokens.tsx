import { Box } from '@chakra-ui/react'
import { useApp, Chain } from './Context/Index'
import { weird } from '../utils/contracts'
import { chains } from '../utils/chains'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { erc20abi } from '../artifacts/erc20'

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

  return <Box>Weird Tokens: {balance}</Box>
}

export default WeirdTokens
