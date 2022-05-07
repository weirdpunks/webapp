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
      const newChain = chains.find((i) => i.id === chainId)
      setSelectedChain(newChain)
    }
  }, [chainId])

  interface SwitchNetworkError {
    code?: number
    message?: string
  }

  const handleSwitchNetwork = async (id: string) => {
    const attemptSwitch = async () => {
      const wallet = window?.ethereum
      if (signer && wallet) {
        try {
          await wallet.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: id }]
          })
          const newChain = chains.find((i) => i.key === id)
          if (newChain) {
            dispatch(
              setChain({
                chainId: newChain.id,
                isTestnet: Boolean(newChain.isTestnet),
                isLayer2: Boolean(newChain.id === 137 || newChain.id === 80001)
              })
            )
          }
          return true
        } catch (_e) {}
      }
      return false
    }

    const addPolygonNetwork = async () => {
      try {
        const wallet = window?.ethereum
        if (wallet) {
          await wallet.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x89',
                chainName: 'Polygon Mainnet',
                nativeCurrency: {
                  name: 'Matic',
                  symbol: 'MATIC',
                  decimals: 18
                },
                rpcUrls: ['https://polygon-rpc.com/'],
                blockExplorerUrls: ['https://polygonscan.com/']
              }
            ]
          })
          dispatch(
            setChain({
              chainId: 137,
              isTestnet: false,
              isLayer2: true
            })
          )
        }
      } catch (_e) {}
    }

    const switched = await attemptSwitch()
    if (!switched && chainId === 1) {
      await addPolygonNetwork()
    }
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
                (item) =>
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
