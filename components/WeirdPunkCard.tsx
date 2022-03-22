import {
  Box,
  Center,
  useColorModeValue,
  Heading,
  Text,
  Stack,
  Image
} from '@chakra-ui/react'

const WeirdPunkCard = ({
  id,
  attributes,
  price
}: {
  id: number
  attributes?: string
  price?: number
}) => {
  return (
    <Center py={12}>
      <Box
        role={'group'}
        p={6}
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
          height={'230px'}
          _after={{
            transition: 'all .3s ease',
            content: '""',
            w: 'full',
            h: 'full',
            pos: 'absolute',
            top: 5,
            left: 0,
            backgroundImage: `url(/wp/${id}.gif)`,
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
            height={230}
            width={282}
            objectFit={'cover'}
            src={`/wp/${id}.gif`}
            alt={`Weird Punk #${id}`}
          />
        </Box>
        <Stack pt={10} align={'center'}>
          <Text color={'gray.500'} fontSize={'sm'} textTransform={'uppercase'}>
            Weird Punk #{id}
          </Text>
          {attributes && (
            <Heading fontSize={'lg'} fontFamily={'body'} fontWeight={500}>
              {attributes}
            </Heading>
          )}
          {price && (
            <Stack direction={'row'} align={'center'}>
              <Text fontWeight={800} fontSize={'xl'}>
                {price} ETH
              </Text>
            </Stack>
          )}
        </Stack>
      </Box>
    </Center>
  )
}

export default WeirdPunkCard
