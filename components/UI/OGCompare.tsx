import {
  Box,
  useColorModeValue,
  SimpleGrid,
  Text,
  Stack,
  Image
} from '@chakra-ui/react'

const OGCompare = () => {
  return (
    <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={8}>
      <Box
        role={'group'}
        p={6}
        m={6}
        maxW={'330px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={'2xl'}
        rounded={'lg'}
        pos={'relative'}
        zIndex={1}>
        <Box
          rounded={'lg'}
          mt={-12}
          pos={'relative'}
          height={'336px'}
          _after={{
            transition: 'all .3s ease',
            content: '""',
            w: 'full',
            h: 'full',
            pos: 'absolute',
            top: 5,
            left: 0,
            backgroundImage: `url(/ogwp/og.gif)`,
            filter: 'blur(15px)',
            zIndex: -1
          }}
          _groupHover={{
            _after: {
              filter: 'blur(20px)'
            }
          }}>
          <Image
            rounded={'lg'}
            height={336}
            width={336}
            objectFit={'cover'}
            alt={'OG Punk'}
            src={`/ogwp/og.gif`}
          />
        </Box>
        <Stack pt={10} align={'center'}>
          <Text color={'gray.500'} fontSize={'sm'} textTransform={'uppercase'}>
            &ldquo;OG Punk 🙌&rdquo;
          </Text>
        </Stack>
      </Box>
      <Box
        role={'group'}
        p={6}
        m={6}
        maxW={'330px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={'2xl'}
        rounded={'lg'}
        pos={'relative'}
        zIndex={1}>
        <Box
          rounded={'lg'}
          mt={-12}
          pos={'relative'}
          height={'336px'}
          _after={{
            transition: 'all .3s ease',
            content: '""',
            w: 'full',
            h: 'full',
            pos: 'absolute',
            top: 5,
            left: 0,
            backgroundImage: `url(/ogwp/ogwp.gif)`,
            filter: 'blur(15px)',
            zIndex: -1
          }}
          _groupHover={{
            _after: {
              filter: 'blur(20px)'
            }
          }}>
          <Image
            rounded={'lg'}
            height={336}
            width={336}
            objectFit={'cover'}
            alt={'Claim Me'}
            src={`/ogwp/ogwp.gif`}
          />
        </Box>
        <Stack pt={10} align={'center'}>
          <Text color={'gray.500'} fontSize={'sm'} textTransform={'uppercase'}>
            &ldquo;Claim Me 🙏&rdquo;
          </Text>
        </Stack>
      </Box>
    </SimpleGrid>
  )
}

export default OGCompare
