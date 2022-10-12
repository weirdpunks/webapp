import {
  Box,
  Center,
  useColorModeValue,
  Heading,
  Text,
  Stack,
  Image
} from '@chakra-ui/react'
import axios from 'axios'
import { useEffect, useState } from 'react'

type Trait = {
  trait_type: string
  value: string
}

type Data = {
  name: string
  description: string
  image: string
  traits: Trait[]
}

const DisplayCard = ({ id, isGold }: { id: number; isGold?: boolean }) => {
  const [img, setImg] = useState('')
  const [name, setName] = useState('')
  const [species, setSpecies] = useState('')
  const [gender, setGender] = useState('')
  const [accessories, setAccessories] = useState('')

  useEffect(() => {
    const getData = async () => {
      const ipfsProvider = 'https://tcvdh.infura-ipfs.io/ipfs/'
      const url = `${ipfsProvider}${
        id > 1000
          ? 'QmcNARPkJiKHViysRQtsVQLEnZGnps1oVka8Jqmi9qdibf'
          : 'QmP3GBeMvgPW6eJrYGxgckjZSMZWYjbkuJNdCNBCLJtFg8'
      }/${id}.json`
      const response = await axios.get(url)
      if (response.data) {
        const metadata = response.data as Data
        setName(metadata.name)
        setImg(`/wp/${id}.gif`)
        const species = metadata.traits.filter((i) => i.trait_type === 'Type')
        setSpecies(species[0]?.value as string)
        const gender = metadata.traits.filter((i) => i.trait_type === 'Gender')
        setGender(gender[0]?.value as string)
        const accessories = metadata.traits.filter(
          (i) => i.trait_type !== 'Type' && i.trait_type !== 'Gender'
        )
        const traits = accessories?.map((i) => i.value)
        setAccessories(traits.join(', '))
      }
    }
    if (!isGold) {
      getData()
    }
  }, [id, isGold])

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
        {img !== '' && (
          <Box
            rounded={'lg'}
            mt={-12}
            pos={'relative'}
            height={'250px'}
            textAlign={'center'}
            _after={{
              transition: 'all .3s ease',
              content: '""',
              w: 'full',
              h: 'full',
              pos: 'absolute',
              top: 5,
              left: 0,
              backgroundColor: '#ffbf00',
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
              height={280}
              width={280}
              objectFit={'cover'}
              src={img}
              alt={`${id > 1000 && 'Expansion '}Weird Punk ${
                isGold ? 'Gold ' : ''
              }#${id}`}
            />
          </Box>
        )}
        <Stack pt={10} align={'center'}>
          <Text color={'gray.500'} fontSize={'sm'} textTransform={'uppercase'}>
            {id > 1000 && 'Expansion '}Weird Punk {isGold ? 'Gold ' : ''}#{id}
          </Text>
          {species !== '' && gender !== '' && (
            <Heading fontSize={'lg'} fontFamily={'body'} fontWeight={500}>
              {gender} {species}
            </Heading>
          )}
          {accessories !== '' && (
            <Heading fontSize={'lg'} fontFamily={'body'} fontWeight={500}>
              {accessories}
            </Heading>
          )}
        </Stack>
      </Box>
    </Center>
  )
}

export default DisplayCard
