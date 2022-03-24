import Card from '@/components/UI/Card'
import WPHeading from '@/components/UI/Heading'
import {
  Container,
  SimpleGrid,
  Stack,
  Text,
  Button,
  Link
} from '@chakra-ui/react'
import type { NextPage } from 'next'

const Home: NextPage = () => {
  return (
    <Container maxW={'5xl'}>
      <WPHeading>Weird Punks Gold</WPHeading>
      <Stack
        textAlign={'center'}
        align={'center'}
        spacing={{ base: 8, md: 10 }}
        pt={{ base: 8, md: 10 }}
        pb={{ base: 20, md: 28 }}>
        <Text color={'gray.500'} maxW={'3xl'}>
          The Weird Punks Gold Collection was created to reward early holders of
          10 Weird Punks as well as future community uses.
        </Text>
        <Stack spacing={6} direction={'row'} textAlign={'center'}>
          <Button
            as={Link}
            rounded={'full'}
            px={6}
            colorScheme={'orange'}
            bg={'orange.400'}
            _hover={{ bg: 'orange.500' }}
            href='https://opensea.io/collection/weird-punks-gold-collection'>
            View on OpenSea
          </Button>
        </Stack>
      </Stack>
      <SimpleGrid columns={{ sm: 1, md: 3 }} spacing={8}>
        <Card id={6} isGold={true} />
        <Card id={38} isGold={true} />
        <Card id={8} isGold={true} />
      </SimpleGrid>
    </Container>
  )
}

export default Home
