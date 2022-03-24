import Address from '@/components/UI/Address'
import Chain from '@/components/UI/Chain'
import { useApp, setStatus, reset } from '@/components/Context'
import { chains } from '@/utils/chains'
import {
  Box,
  Button,
  Icon,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  useDisclosure
} from '@chakra-ui/react'
import { FaWallet } from 'react-icons/fa'
import { useEffect, useState } from 'react'

const Web3 = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { state, dispatch } = useApp()
  const { address, chain } = state

  const [explorer, setExplorer] = useState('')

  useEffect(() => {
    if (chain && address) {
      const found = chains.find((i) => i.key === chain)
      if (found) {
        setExplorer(`${found.explorer}/address/${address}`)
      }
    }
  }, [chain, address])

  return (
    <>
      {address ? (
        <>
          <Chain />
          <Button onClick={onOpen} mx={2}>
            <Address address={address} avatar='right' size={4} />
          </Button>
          {address && (
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Account</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Address address={address} avatar='left' size={8} copyable />
                  {explorer && (
                    <Box mt={10} px={10}>
                      <Link href={explorer} isExternal>
                        View on Explorer
                      </Link>
                    </Box>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button
                    colorScheme='red'
                    mr={3}
                    onClick={async () => {
                      dispatch(reset())
                      window.localStorage.removeItem(
                        'WEB3_CONNECT_CACHED_PROVIDER'
                      )
                      onClose()
                    }}>
                    Disconnect
                  </Button>
                  <Button variant='ghost' onClick={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          )}
        </>
      ) : (
        <Box>
          <Button onClick={() => dispatch(setStatus(true))}>
            <Icon as={FaWallet} />
          </Button>
        </Box>
      )}
    </>
  )
}

export default Web3
