import type { NextPage } from 'next'
import { Box, Heading, Link } from '@chakra-ui/react'

const Contact: NextPage = () => {
  return (
    <Box>
      <Heading
        fontWeight={600}
        fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}>
        Contact
      </Heading>
      <Box p={4}>
        OpenSea:{' '}
        <Link href='https://opensea.io/assets/weird-punks-collection'>
          Weird Punks Collection
        </Link>
      </Box>
      <Box p={4}>
        Discord Group:{' '}
        <Link href='https://discord.gg/hkCHFCwP'>
          https://discord.gg/hkCHFCwP
        </Link>
      </Box>
      <Box p={4}>
        Email:{' '}
        <Link href='mailto:hello@weirdpunks.club'>hello@weirdpunks.club</Link>
      </Box>
       <Box p={4}>
        Twitter:{' '}
        <Link href='https://twitter.com/WeirdpunkFans'>
         Weird Punks Fans
         </Link>
      </Box>
       <Box p={4}>
        Face Book Fan-Page:{' '}
        <Link href='https://www.facebook.com/weirdpunkscollection'>
          Weird Punks Collection
         </Link>
      </Box>
    </Box>
  )
}

export default Contact
