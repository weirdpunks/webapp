import type { NextPage } from 'next'
import { Box, Heading } from '@chakra-ui/react'

const Migration: NextPage = () => {
  return (
    <Box>
      <Heading
        fontWeight={600}
        fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}>
        Migration
      </Heading>
    </Box>
  )
}

export default Migration
