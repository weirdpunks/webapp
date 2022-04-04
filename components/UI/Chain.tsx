import { setChain, useApp } from '@/components/Context'
import { ETHLogo, PolygonLogo } from '@/components/UI/Logos'
import { ChainData, chains } from '@/utils/chains'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

const displayTestnets = false

const ChainComponent = () => {
  const { state, dispatch } = useApp()
  const { chainId, signer } = state

  const [selectedChain, setSelectedChain] = useState<ChainData>()

  useEffect(() => {
    if (chainId) {
      const newChain = chains.find(i => i.id === chainId)
      setSelectedChain(newChain)
    }
  }, [chainId])

  interface SwitchNetworkError {
    code?: number
    message?: string
  }

  const handleSwitchNetwork = (id: string) => {
    const attemptSwitch = async () => {
      if (signer) {
        try {
          await window?.ethereum?.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: id }]
          })
          const newChain = chains.find(i => i.key === id)
          if (newChain) {
            dispatch(
              setChain({
                chainId: newChain.id,
                isTestnet: Boolean(newChain.isTestnet),
                isLayer2: Boolean(newChain.id === 137 || newChain.id === 80001)
              })
            )
          }
        } catch (e) {
          if (typeof e === 'object' && e !== null && 'code' in e) {
            const values: any[] = Object.values(e)
            if (values.includes(4902)) {
              try {
                const newChain = chains.find(i => i.key === id)
                if (newChain?.parameter) {
                  await window?.ethereum?.request({
                    method: 'wallet_addEthereumChain',
                    params: newChain.parameter
                  })
                  // dispatch(
                  //   setChain({
                  //     chain: newChain.id,
                  //     isTestnet: Boolean(newChain.testnet)
                  //   })
                  // )
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
            {selectedChain ? selectedChain.title : 'Switch Chain'}
          </MenuButton>
          <MenuList>
            <>
              {chains.map(
                item =>
                  (!item.isTestnet || (item.isTestnet && displayTestnets)) && (
                    <MenuItem
                      key={item.hex}
                      icon={
                        item.icon === 'polygon' ? <PolygonLogo /> : <ETHLogo />
                      }
                      onClick={() => handleSwitchNetwork(item.hex)}>
                      {item.title}
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
