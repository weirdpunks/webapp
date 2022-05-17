import NavLink from '@/components/UI/NavLink'
import Web3 from '@/components/UI/Web3'
import { useApp } from '@/components/Context'
import {
  Alert,
  AlertIcon,
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  useDisclosure,
  useColorMode,
  useColorModeValue,
  Stack
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from '@chakra-ui/icons'
import Image from 'next/image'

const Links = [
  { slug: '/', title: 'HOME' },
  { slug: '/dao', title: 'DAO' },
  { slug: '/gold', title: 'GOLD' },
  { slug: '/migrate', title: 'MIGRATE' }
  // { slug: '/tokens', title: 'TOKENS' },
]

const Bar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { colorMode, toggleColorMode } = useColorMode()
  const { state } = useApp()
  const { isTestnet } = state

  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <Box>
              <Image src='/24px.png' alt='' width={24} height={24} />
            </Box>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}>
              {Links.map((link) => (
                <NavLink key={link.slug} slug={link.slug}>
                  {link.title}
                </NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            <Box m='2'>
              <Button onClick={toggleColorMode}>
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button>
            </Box>
            <Web3 />
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link.slug} slug={link.slug}>
                  {link.title}
                </NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
      {isTestnet && (
        <Alert status='warning'>
          <AlertIcon />
          You are currently on testnet.
        </Alert>
      )}
    </>
  )
}

export default Bar
