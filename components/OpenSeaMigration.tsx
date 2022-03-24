import { useApp } from '../components/Context/Index'
import { Box, Button, Flex, Icon, Stack, Text } from '@chakra-ui/react'
import { FaCheckCircle } from 'react-icons/fa'
import { useEffect, useState } from 'react'

const OpenSeaMigration = () => {
  const { state } = useApp()

  const [granted, setGranted] = useState(false)

  const handlePermission = async () => {
    setGranted(true)
  }
  const handleBurnAndMint = async () => {}

  return (
    <Box>
      <Text>1. Permission to Burn 🔥 OpenSea Assets?</Text>
      {granted ? (
        <Stack direction={'row'} align={'center'}>
          <Flex
            w={8}
            h={8}
            align={'center'}
            justify={'center'}
            rounded={'full'}>
            <Icon as={FaCheckCircle} color='green.500' />
          </Flex>
          <Text fontWeight={600}>Permission Granted</Text>
        </Stack>
      ) : (
        <Button onClick={handlePermission}>Yes please 🙏</Button>
      )}
      <Text>2. Burn 🔥 OpenSea Weird Punk & Mint Migrated Weird Punk</Text>
      <Button onClick={handleBurnAndMint} disabled={!granted}>
        Yes please 🙏
      </Button>
    </Box>
  )
}

export default OpenSeaMigration
