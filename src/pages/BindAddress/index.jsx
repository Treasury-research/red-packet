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

export default function BindAddress({ back }) {
  const { userInfo, updateUserInfo, getUserInfo } = useUserStore()
  const { provider: metamaskProvider, sdk } = useSDK()
  const [isBind, setIsBind] = useState(false)
  const [signature, setSignature] = useState('')

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

      back()
    } catch (error) {
      alert(error.message)
    }
  }, [metamaskProvider])

  if (!isBind) {
    return (
      <Box
        width="100%"
        height="100%"
        position="relative"
      >
        <Box
          position="absolute"
          top="0"
          left="0"
          color="white"
          width="100%"
          height="44px"
        >
          <Box
            width="100%"
            height="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            Digital gifts
          </Box>
        </Box>
        <Box
          width="100%"
          height="100%"
          paddingTop="44px"
        >
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
                  绑定地址
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
                去绑定
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <Box
      width="100%"
      height="100%"
      position="relative"
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        color="white"
        width="100%"
        height="44px"
      >
        <Box
          width="100%"
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          Digital gifts
        </Box>
      </Box>
      <Box
        width="100%"
        height="100%"
      >
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
                绑定地址
              </Box>
              <Box fontSize="16px" color="white">请绑定您的钱包地址，领取红包</Box>
              <Box fontSize="16px" color="white">当前地址：<Box as="span" textDecoration="underline">0x47B...D204E</Box></Box>
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
      </Box>
    </Box>
  )
}
