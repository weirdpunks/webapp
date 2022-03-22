import Blockies from 'react-blockies'
import { Box } from '@chakra-ui/react'

interface BlockieProps {
  address?: string
  currentWallet?: string
  size?: number
}

const Blockie = ({ address, currentWallet, size }: BlockieProps) => {
  return (
    <Box>
      <Blockies
        seed={address ? address.toLowerCase() : ''}
        scale={size ? size : 3}
        className='identicon'
      />
    </Box>
  )
}

export default Blockie
