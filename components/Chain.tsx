import { ETHLogo, PolygonLogo } from './Logos'
import { useApp, setChain } from './Context/Index'
import { chains, ChainData } from '../utils/chains'
import { Button, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { ethers } from 'ethers'
// import WalletConnectProvider from '@walletconnect/web3-provider'
// import Web3Modal from 'web3modal'
import { ErrorInfo, useEffect, useState } from 'react'

const displayTestnets = false

const ChainComponent = () => {
  const { state, dispatch } = useApp()
  const { chain, provider } = state

  const [selectedChain, setSelectedChain] = useState<ChainData | undefined>()

  useEffect(() => {
    if (chain) {
      const newChain = chains.find((i) => i.id === chain)
      setSelectedChain(newChain)
    }
  }, [chain])

  interface SwitchNetworkError {
    code?: number
    message?: string
  }

  const handleSwitchNetwork = (id: string) => {
    const attemptSwitch = async () => {
      if (provider) {
        try {
          await window?.ethereum?.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: id }]
          })
          const newChain = chains.find((i) => i.key === id)
          if (newChain) {
            dispatch(setChain(newChain.id))
          }
        } catch (e) {
          if (typeof e === 'object' && e !== null && 'code' in e) {
            const values: any[] = Object.values(e)
            if (values.includes(4902)) {
              try {
                const newChain = chains.find((i) => i.key === id)
                if (newChain?.parameter) {
                  await window?.ethereum?.request({
                    method: 'wallet_addEthereumChain',
                    params: newChain.parameter
                  })
                  dispatch(setChain(newChain.id))
                }
              } catch (addError) {
                console.log('Unable to add network')
              }
            }
          }
        }
      }
    }
    attemptSwitch()
  }

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
                      onClick={() => handleSwitchNetwork(item.key)}>
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
