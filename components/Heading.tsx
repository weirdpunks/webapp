import { Heading as ChakraHeading } from '@chakra-ui/react'
import * as React from 'react'

const Heading = ({ children }: { children: React.ReactNode }) => {
  return (
    <ChakraHeading
      fontWeight={600}
      textAlign={'center'}
      fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}>
      <>{children}</>
    </ChakraHeading>
  )
}

export default Heading
