import WPHeading from '@/components/UI/Heading'
import { ethereum, mumbai, polygon, rinkeby } from '@/utils/mappings'
import {
  Container,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text
} from '@chakra-ui/react'
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
      <Tabs variant='soft-rounded' colorScheme='green'>
        <TabList>
          <Tab>Ethereum</Tab>
          <Tab>Polygon</Tab>
          <Tab>Rinkeby</Tab>
          <Tab>Mumbai</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Title>Ethereum IDs:</Title>
            <Text>[{ethereum.map(i => i.id).join(',')}]</Text>
            <Title>Ethereum OpenSea IDs:</Title>
            <Text>[{ethereum.map(i => i.osid).join(',')}]</Text>
          </TabPanel>
          <TabPanel>
            <Title>Polygon IDs:</Title>
            <Text>[{polygon.map(i => i.id).join(',')}]</Text>
            <Title>Polygon OpenSea IDs:</Title>
            <Text>[{polygon.map(i => i.osid).join(',')}]</Text>
          </TabPanel>
          <TabPanel>
            <Title>Rinkeby IDs:</Title>
            <Text>[{rinkeby.map(i => i.id).join(',')}]</Text>
            <Title>Rinkeby OpenSea IDs:</Title>
            <Text>[{rinkeby.map(i => i.osid).join(',')}]</Text>
          </TabPanel>
          <TabPanel>
            <Title>Mumbai IDs:</Title>
            <Text>[{mumbai.map(i => i.id).join(',')}]</Text>
            <Title>Mumbai OpenSea IDs:</Title>
            <Text>[{mumbai.map(i => i.osid).join(',')}]</Text>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  )
}

export default Mapping
