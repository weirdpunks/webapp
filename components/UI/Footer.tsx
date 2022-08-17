import {
  Box,
  Container,
  Stack,
  Text,
  useColorModeValue
} from '@chakra-ui/react'
import { FaDiscord, FaMedium, FaTwitter, FaYoutube } from 'react-icons/fa'
import SocialButton from '@/components/UI/SocialButton'
// import OpenSeaIcon from '@/components/UI/OpenSeaIcon'

const Footer = () => {
  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
      mt={12}>
      <Container
        as={Stack}
        maxW={'6xl'}
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}>
        <Text>
          © {new Date().getFullYear()} Weird Punks Collection. All rights
          reserved
        </Text>
        <Stack direction={'row'} spacing={6}>
          {/* <SocialButton
            label={'OpenSea'}
            href={'https://opensea.io/collection/weird-punks-collection'}>
            <OpenSeaIcon />
          </SocialButton> */}
          <SocialButton
            label={'Twitter'}
            href={'https://twitter.com/weirdpunksnft'}>
            <FaTwitter />
          </SocialButton>
          <SocialButton
            label={'Discord'}
            href={'https://discord.gg/S5suf6pR8M'}>
            <FaDiscord />
          </SocialButton>
          <SocialButton
            label={'Medium'}
            href={'https://www.medium.com/@weirdpunkscollection'}>
            <FaMedium />
          </SocialButton>
          <SocialButton
            label={'YouTube'}
            href={'https://www.youtube.com/channel/UClFZrpj9KgLz6MFa6zF21Cw'}>
            <FaYoutube />
          </SocialButton>
        </Stack>
      </Container>
    </Box>
  )
}

export default Footer
