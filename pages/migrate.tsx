import OpenSeaMigration from '@/components/OpenSeaMigration'
import Heading from '@/components/UI/Heading'
import { Box } from '@chakra-ui/react'
import type { NextPage } from 'next'

const Migration: NextPage = () => {
  return (
    <Box>
      <Heading>OpenSea Weird Punks</Heading>
      <OpenSeaMigration />
    </Box>
  )
}

export default Migration
