import { Heading as ChakraHeading, Stack } from '@chakra-ui/react'
import * as React from 'react'

const Heading = ({ children }: { children: React.ReactNode }) => {
  return (
    <Stack
      textAlign={'center'}
      align={'center'}
      spacing={{ base: 8, md: 10 }}
      py={{ base: 8, md: 10 }}>
      <ChakraHeading
        fontWeight={600}
        textAlign={'center'}
        fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}>
        <>{children}</>
      </ChakraHeading>
    </Stack>
  )
}

export default Heading
