import { useApp } from '../components/Context/Index'
import type { NextPage } from 'next'
import { Box, Heading, Text, Stack } from '@chakra-ui/react'

const Migration: NextPage = () => {
  const { state } = useApp()
  const { osMainnet, osLayer2 } = state
  return (
    <Box>
      <Heading
        fontWeight={600}
        fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}>
        OpenSea Weird Punks
      </Heading>
      {osMainnet.length > 0 && (
        <Stack direction={'row'} align={'center'} justify={'start'}>
          <Text fontSize={'4xl'} fontWeight={400} p={2}>
            Ethereum:
          </Text>
          <Text fontSize={'xl'} fontWeight={200} p={2}>
            {`#${osMainnet.join(', #')}`}
          </Text>
        </Stack>
      )}
      {osLayer2.length > 0 && (
        <Stack direction={'row'} align={'center'} justify={'start'}>
          <Text fontSize={'4xl'} fontWeight={400} p={2}>
            Polygon:
          </Text>
          <Text fontSize={'xl'} fontWeight={200} p={2}>{`#${osLayer2.join(
            ', #'
          )}`}</Text>
        </Stack>
      )}
    </Box>
  )
}

export default Migration
