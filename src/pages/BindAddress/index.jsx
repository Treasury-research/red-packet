import { useState, useCallback } from 'react'
import { Box, Image, Button } from '@chakra-ui/react'
import LogoIcon from "@/components/Icons/Logo"
import SignInIcon from "@/components/Icons/SignIn"
import BackIcon from "@/components/Icons/Back"
import GiftImage from "@/assets/images/gift.png"
import { useSDK } from '@metamask/sdk-react'
import * as api from '@/api'
import { useUserStore } from '@/store/user'
import { ethers, BrowserProvider } from 'ethers'
import Screen from '@/components/Screen'

export const toShortAddress = (address, firstSlice = 6, lastSlice = 4) => {
  if (address.length > 10) {
    return `${address.slice(0, firstSlice)}...${address.slice(-lastSlice)}`
  }

  return address
}

export default function BindAddress({ onBack }) {
  const { userInfo, updateUserInfo, getUserInfo } = useUserStore()
  const { provider: metamaskProvider, sdk } = useSDK()
  const [isBind, setIsBind] = useState(false)
  const [signature, setSignature] = useState('')
  const { address } = userInfo

  const bindAddress = useCallback(async () => {
    try {
      const userInfo = getUserInfo()
      const accounts = await sdk.connect()
      const address = accounts[0]

      const { token } = userInfo
      const message = await api.challenge({ address }, {
        requireAuth: true,
        tokenFetcher: () => token
      })

      const provider = new ethers.BrowserProvider(metamaskProvider)
      const signer = await provider.getSigner()
      const signature = await signer.signMessage(message)

      const res2 = await api.bindAddress({
        address,
        signature
      }, {
        requireAuth: true,
        tokenFetcher: () => token
      })

      const res3 = await api.getUserInfo({}, {
        requireAuth: true,
        tokenFetcher: () => token
      })

      updateUserInfo({
        ...res3,
      })

      onBack()
    } catch (error) {
      alert(error.message)
    }
  }, [metamaskProvider, onBack])

  if (!isBind) {
    return (
      <Screen onBack={onBack}>
        <Box
          width="100%"
          height="100%"
          padding="32px"
          display="flex"
          flexDirection="column"
        >
          <Box
            borderRadius="10px"
            padding="20px"
            marginTop="40px"
            marginBottom="40px"
            background="linear-gradient(0deg, #1F2861 0%, #30486D 89.32%)"
          >
            <Box marginBottom="20px">
              <LogoIcon />
            </Box>
            <Box
              width="100%"
              display="flex"
              flexDirection="column"
              alignItems="center"
              marginBottom="20px"
            >
              <Box
                fontSize="32px"
                color="white"
                marginBottom="20px"
                fontWeight="bold"
              >
                Connect your wallet now to confirm your ownership of a TypoX AI Fans NFT.
              </Box>
              <Box fontSize="16px" color="white">请绑定您的钱包地址，领取红包</Box>
            </Box>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box color="white" onClick={() => {}}>{``}</Box>
              <Box>
                <Image src={GiftImage} />
              </Box>
            </Box>
          </Box>
          <Box width="100%" marginBottom="40px" marginTop="auto">
            <Button width="100%" borderRadius="50px" height="50px" fontSize="16px" fontWeight="bold" onClick={bindAddress}>
              Connect your Wallet
            </Button>
          </Box>
        </Box>
      </Screen>
    )
  }

  return (
    <Screen>
      <Box
        width="100%"
        height="100%"
        padding="32px"
        display="flex"
        flexDirection="column"
      >
        <Box
          borderRadius="10px"
          padding="20px"
          marginTop="40px"
          background="linear-gradient(0deg, #1F2861 0%, #30486D 89.32%)"
        >
          <Box marginBottom="20px">
            <LogoIcon />
          </Box>
          <Box
            width="100%"
            display="flex"
            flexDirection="column"
            alignItems="center"
            marginBottom="20px"
          >
            <Box
              fontSize="32px"
              color="white"
              marginBottom="20px"
              fontWeight="bold"
            >
              Connect your wallet now to confirm your ownership of a TypoX AI Fans NFT.
            </Box>
            <Box fontSize="16px" color="white">请绑定您的钱包地址，领取红包</Box>
            <Box fontSize="16px" color="white">当前地址：<Box as="span" textDecoration="underline">{toShortAddress(address || '')}</Box></Box>
          </Box>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box color="white" onClick={() => {}}>{``}</Box>
            <Box>
              <Image src={GiftImage} />
            </Box>
          </Box>
        </Box>
        <Box width="100%" marginBottom="40px" marginTop="auto">
          <Button width="100%" borderRadius="50px" height="50px" fontSize="16px" fontWeight="bold" onClick={() => {}} marginBottom="20px">
            修改地址
          </Button>
          <Button width="100%" borderRadius="50px" height="50px" fontSize="16px" fontWeight="bold" onClick={() => setIsBind(false)} background="transparent" color="white" border="1px solid white">
            解除定绑
          </Button>
        </Box>
      </Box>
    </Screen>
  )
}
