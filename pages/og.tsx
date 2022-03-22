import type { NextPage } from 'next'
import Head from 'next/head'
import { Avatar, Box, Link } from '@chakra-ui/react'
import OGCompare from '../components/OGCompare'
import Hero from '../components/Hero'
import { useState, useMemo } from 'react'
import Heading from '../components/Heading'

const useHover = () => {
  const [hovered, setHovered] = useState<boolean>(false)

  const eventHandlers = useMemo(
    () => ({
      onMouseOver() {
        setHovered(true)
      },
      onMouseOut() {
        setHovered(false)
      }
    }),
    []
  )

  return [hovered, eventHandlers]
}

const OGWP: NextPage = () => {
  const [weirdActivated, eventHandlers] = useHover()

  return (
    <Box>
      <Head>
        <title>OG Weird Punks</title>
        <meta
          name='description'
          content='We have mad respect for the OG punks 👊'
        />
      </Head>
      <Box mt={4} p={4} textAlign={'center'}>
        🚨Photosensitive Seizure Warning🚨
      </Box>
      <Heading>OG Weird Punks</Heading>
      <Box mt={4} p={4} textAlign={'center'}>
        We have mad respect for the OG Punks 👊
        <br />
        Donate any amount to{' '}
        <Link
          href='https://thegivingblock.com/donate/epilepsy-foundation-of-america/'
          textDecoration='underline'
          color='#a4315a'>
          Epilepsy Foundation of America
        </Link>{' '}
        and that is it, you are now an OG Weird Punk.
      </Box>
      <Box p={4} textAlign={'center'}>
        Hit up any of our socials and we will mint your OG Weird Punk w/
        &ldquo;seizure&rdquo; background.
      </Box>
      <OGCompare />
      <Box p={4} textAlign={'center'}>
        All weird punks are equal, including OGs! You become part of the Weird
        Punks DAO.
      </Box>
      <Box p={4} textAlign={'center'}>
        By the way, they look amazing on Discord Nitro.
        <br />
        (Animates on hover)
      </Box>
      <Box textAlign={'center'}>
        {weirdActivated ? (
          <Avatar
            {...eventHandlers}
            size={'xl'}
            src={'/ogwp/ogwp.gif'}
            alt={'OG Weird Punk'}
            mb={4}
          />
        ) : (
          <Avatar
            {...eventHandlers}
            size={'xl'}
            src={'/ogwp/og.gif'}
            alt={'OG Punk'}
            mb={4}
          />
        )}
      </Box>
      <Hero />
    </Box>
  )
}

export default OGWP
