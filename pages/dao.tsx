import WPHeading from '@/components/UI/Heading'
import { Box, Button, Heading, Link, Stack } from '@chakra-ui/react'
import type { NextPage } from 'next'
import Head from 'next/head'

const DAO: NextPage = () => {
  return (
    <Box>
      <Head>
        <title>Weird Punks DAO</title>
        <meta
          name='description'
          content='Community driven Decentralized Autonomous Organization with voting based on WEIRD token ownership.'
        />
      </Head>
      <WPHeading>Weird Punks DAO</WPHeading>
      <Box mt={4} p={4}>
        The Weird Punks DAO (Decentralized Autonomous Organization) is entirely
        community driven. Anyone with at least 1 WEIRD token is able to cast a
        vote for available proposals. Voting power is based on the total number
        of WEIRD tokens owned at time of proposal snapshot. A simple majority is
        required for a proposal to pass. Currently, a minimum of 60 token are
        required to create a new proposal. The DAO was created to help our
        “weird” community grow by allowing for fair and transparent governance
        that will guide our community efforts.
      </Box>
      <Heading as='h3' size='lg'>
        Tokenomics
      </Heading>
      <Box p={4}>
        There are a thousand Weird Punks each able to receive one token per day
        for a hundred years. 1,000 Weird Punks x 365.25 days in a year x 100
        years = 36,525,000 tokens
      </Box>
      <Box p={4}>
        Tokens were also created to possibly offer voting rights to “OG” Weird
        Punks. 10,000 “OG” Weird Punks x 365.25 days in a year x 100 years =
        365,250,000 tokens.
      </Box>
      <Box p={4}>
        The maximum supply is 36,525,000 + 365,250,000 = 401,775,000 tokens
      </Box>
      <Box p={4}>
        After the passing of{' '}
        <Link href='https://snapshot.org/#/weirdpunks.eth/proposal/0x196404d167bed4477eeb674ba2287969f6ae5fffde7cb6e6fc8f8387cb427d65'>
          Weird Punks DAO Proposal #1
        </Link>{' '}
        (Should $WEIRD tokens reserved for the OG Weird Punks be burned?)
        365,250,000 tokens were burned leaving a total supply of 36,525,000
        tokens.
      </Box>
      <Box p={4}>
        As of March 16, 2022 the current circulating supply is 131,478 tokens.
      </Box>
      <Stack spacing={6} direction={'row'}>
        <Button
          as={Link}
          rounded={'full'}
          px={6}
          colorScheme={'orange'}
          bg={'orange.400'}
          _hover={{ bg: 'orange.500' }}
          href='https://snapshot.org/#/weirdpunks.eth'>
          Weird Punks DAO
        </Button>
      </Stack>
    </Box>
  )
}

export default DAO
