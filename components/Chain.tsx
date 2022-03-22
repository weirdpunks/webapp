import { ETHLogo, PolygonLogo } from './Logos'
import { useApp, setChain } from './Context/Index'
import { chains, ChainData } from '../utils/chains'
import { Button, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { ethers } from 'ethers'
// import WalletConnectProvider from '@walletconnect/web3-provider'
// import Web3Modal from 'web3modal'
import { useEffect, useState } from 'react'

const displayTestnets = false

const ChainComponent = () => {
  const { state, dispatch } = useApp()
  const { chain } = state

  const [selectedChain, setSelectedChain] = useState<ChainData | undefined>()

  useEffect(() => {
    if (chain) {
      const newChain = chains.find((i) => i.id === chain)
      setSelectedChain(newChain)
    }
  }, [chain])

  return (
    <Menu>
      {({ isOpen }) => (
        <>
          <MenuButton
            isActive={isOpen}
            as={Button}
            rightIcon={<ChevronDownIcon />}>
            {selectedChain ? selectedChain.value : 'Switch Chain'}
          </MenuButton>
          <MenuList>
            <>
              {chains.map(
                (item) =>
                  (!item.testnet || (item.testnet && displayTestnets)) && (
                    <MenuItem
                      key={item.key}
                      icon={
                        item.icon === 'polygon' ? <PolygonLogo /> : <ETHLogo />
                      }
                      onClick={() => {
                        console.log(`Need to switch network to ${item.value}`)
                        dispatch(setChain(item.id))
                      }}>
                      {item.value}
                    </MenuItem>
                  )
              )}
            </>
          </MenuList>
        </>
      )}
    </Menu>
  )
}

export default ChainComponent
