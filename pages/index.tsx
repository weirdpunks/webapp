import Hero from '@/components/UI/Hero'
import WeirdPunkCard from '@/components/UI/WeirdPunkCard'
import Testimonial from '@/components/UI/Testimonial'
import { Container, SimpleGrid } from '@chakra-ui/react'
import type { NextPage } from 'next'

const Home: NextPage = () => {
  return (
    <Container maxW={'5xl'}>
      <Hero />
      <SimpleGrid columns={{ sm: 1, md: 3 }} spacing={8}>
        <WeirdPunkCard id={1} attributes={'Hat, Male, Alien'} />
        <WeirdPunkCard
          id={9}
          attributes={'Earring, Sunglasses, Male, Ape, Cyborg'}
        />
        <WeirdPunkCard id={4} attributes={'VR, Male, Alien'} />
        {/* <WeirdPunkCard
          id={208}
          attributes={
            '3D Glasses, Arkanoid Game, Crazy Hair, Earring, Female, Human'
          }
        />
        <WeirdPunkCard
          id={444}
          attributes={'Earring, Shaved Head, Male, Unknown'}
        />
        <WeirdPunkCard
          id={390}
          attributes={'Bandana, Nerd Glasses, Male, Vampire'}
        /> */}
      </SimpleGrid>
      <Testimonial
        name={'Greg'}
        handle={'greg16676935420'}
        avatar={'/testimonials/greg.jpg'}
        link={'https://twitter.com/greg16676935420/status/1430200877227388929'}>
        Shameless NFT plug: I can’t afford $200,000 punks so I’ve been buying
        these dollar store $15 “Weird Punks” because they have cool animations
        and are cheap.. no idea who creator is (no Twitter or discord) but just
        wanted to share because they’re cool
      </Testimonial>
    </Container>
  )
}

export default Home
