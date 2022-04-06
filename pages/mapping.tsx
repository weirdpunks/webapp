import WPHeading from '@/components/UI/Heading'
import { ethereum, polygon } from '@/utils/mappings'
import { Container, Heading, Text } from '@chakra-ui/react'
import type { NextPage } from 'next'
import * as React from 'react'

const Title = ({ children }: { children: React.ReactNode }) => (
  <Heading
    fontWeight={400}
    textAlign={'center'}
    fontSize={{ base: 'xl', sm: '2xl', md: '3xl' }}
    py={8}>
    {children}
  </Heading>
)

const Mapping: NextPage = () => {
  return (
    <Container maxW={'5xl'}>
      <WPHeading>Mappings</WPHeading>
      <Title>Ethereum IDs:</Title>
      <Text>[{ethereum.map(i => i.id).join(',')}]</Text>
      <Title>Ethereum OpenSea IDs:</Title>
      <Text>[{ethereum.map(i => i.osid).join(',')}]</Text>
      <Title>Polygon IDs:</Title>
      <Text>[{polygon.map(i => i.id).join(',')}]</Text>
      <Title>Polygon OpenSea IDs:</Title>
      <Text>[{polygon.map(i => i.osid).join(',')}]</Text>
    </Container>
  )
}

export default Mapping
