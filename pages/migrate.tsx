import OpenSeaMigration from '@/components/OpenSeaMigration'
import { Box, Heading } from '@chakra-ui/react'
import type { NextPage } from 'next'

const Migration: NextPage = () => {
  return (
    <Box>
      <Heading
        fontWeight={600}
        fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}>
        OpenSea Weird Punks
      </Heading>
      <OpenSeaMigration />
    </Box>
  )
}

export default Migration
