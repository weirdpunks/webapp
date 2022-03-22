import { AppContext } from './Context/context'
import { Box, Text } from '@chakra-ui/react'
import { useContext } from 'react'

const Debug = () => {
  const { state } = useContext(AppContext)
  const { instance, provider, signer, chain, address } = state

  return (
    <Box>
      <Text>Has Instance? {instance ? 'Yes' : 'No'}</Text>
      <Text>Has Provider? {provider ? 'Yes' : 'No'}</Text>
      <Text>Has Signer? {signer ? 'Yes' : 'No'}</Text>
      <Text>Current Chain: {chain}</Text>
      <Text>Current Address: {address}</Text>
    </Box>
  )
}

export default Debug
