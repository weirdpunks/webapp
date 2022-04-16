import { weirdPunksLayer2Abi } from '@/artifacts/weirdPunksLayer2'
import { weirdPunksMainnetAbi } from '@/artifacts/weirdPunksMainnet'
import { useApp } from '@/components/Context'
import { weirdPunks } from '@/utils/contracts'
import { Box, Button, Input, Text } from '@chakra-ui/react'
import { ethers } from 'ethers'
import * as React from 'react'

const infuraId = process.env.NEXT_PUBLIC_INFURA_ID
const mainnetChain = 'rinkeby' // 'goerli'

const Bridge = () => {
  const { state, dispatch } = useApp()
  const { chainId, signer, address, isLayer2, isTestnet, weirdPunksLayer2 } =
    state

  const [ids, setIds] = React.useState('')
  const [mainnetProvider, setMainnetProvider] =
    React.useState<ethers.providers.JsonRpcProvider>()

  React.useEffect(() => {
    setIds(weirdPunksLayer2.join(', '))
  }, [weirdPunksLayer2])

  React.useEffect(() => {
    if (isTestnet) {
      //  setMainnetProvider(new ethers.providers.JsonRpcProvider(
      //    `https://goerli.infura.io/v3/${infuraId}`
      // ))
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
    ? 'Bridge from Mumbai to Goerli'
    : 'Bridge from Polygon to Ethereum'

  const handleIds = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIds(e.target.value)
  }

  const handleBridge = async () => {
    try {
      const bridgeIds = ids.split(', ').map((i) => parseInt(i))

      const l2Contract = isTestnet ? weirdPunks.mumbai : weirdPunks.polygon
      const mainnetContract = isTestnet
        ? weirdPunks.rinkeby
        : weirdPunks.mainnet
      // const mainnetContract = isTestnet ? weirdPunks.goerli : weirdPunks.mainnet

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
      const gasPrice = await mainnetProvider?.getGasPrice()
      const price = gasPrice ? gasPrice.toString() : ''
      const gasFormat = parseInt(ethers.utils.formatUnits(mainnetGas, 'wei'))
      const priceFormat = parseInt(ethers.utils.formatUnits(price, 'wei')) * 1.1
      const gas1 = ethers.utils.formatEther(gasFormat * priceFormat)

      const gas2 = await wpL2.gasETH()
      const gas = gas1 > gas2 ? gas1 : gas2
      wpL2.batchBridge(bridgeIds.join(', '), gas)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <Box>
      <Text>{welcome}</Text>
      <Input
        placeholder='Weird Punk IDs (comma separated)'
        value={ids}
        onChange={handleIds}
      />
      <Button onClick={handleBridge}>Bridge</Button>
    </Box>
  )
}

export default Bridge
