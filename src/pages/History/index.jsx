import { useState, useCallback, useEffect, Fragment } from 'react'
import { Box, Image, Button, useToast } from '@chakra-ui/react'
import LogoIcon from "@/components/Icons/Logo"
import SignInIcon from "@/components/Icons/SignIn"
import BackIcon from "@/components/Icons/Back"
import GiftImage from "@/assets/images/gift.png"
import { useSDK } from '@metamask/sdk-react'
import { redPacketApi } from '@/api'
import { useUserStore } from '@/store/user'
import ActivityRules from '@/pages/ActivityRules'
import Send from '@/pages/Send'
import BindAddress from '@/pages/BindAddress'
import * as api from '@/api'
import { ethers, BrowserProvider } from 'ethers'

export default function Home() {
  const [intent, setIntent] = useState('send')
  const [activePage, setActivePage] = useState('home')
  const [isShowRules, setIsShowRules] = useState(false)
  const [isLogingIn, setIsLogingIn] = useState(false)
  const [account, setAccount] = useState('test')
  const { sdk, connected, connecting, provider: metamaskProvider, chainId } = useSDK()
  const { userInfo, updateUserInfo, getUserInfo } = useUserStore()
  const [isClaiming, setIsClaiming] = useState(false)
  const isSignedIn = !!userInfo && !!userInfo.token
  const toast = useToast();
  console.log('userInfo', userInfo, connecting)

  const disabled = isLogingIn
  const loading = isLogingIn

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
            background="linear-gradient(0deg, #1F2861 0%, #30486D 89.32%)"
            padding="20px"
            marginTop="40px"
            marginBottom="40px"
          >
            <Box marginBottom="20px">
              <LogoIcon />
            </Box>
            <Box
              fontSize="32px"
              fontWeight="600"
              color="white"
              marginBottom="20px"
            >
              Send Digital gifts to your friends !
            </Box>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box color="white" cursor="pointer" onClick={() => setActivePage('activityRules')}>{`活动规则>`}</Box>
              <Box>
                <Image src={GiftImage} />
              </Box>
            </Box>
          </Box>
          {!isSignedIn && (
            <Box width="100%" marginBottom="40px" marginTop="auto">
              <Button
                width="100%"
                borderRadius="50px"
                height="50px"
                fontSize="16px"
                fontWeight="bold"
                opacity={(disabled || loading) ? '0.5' : '1'}
                cursor={(disabled || loading) ? 'disabled' : 'default'}
                onClick={signIn}
                loading={loading}
                disabled={disabled}
              >
                <Box marginRight="8px"><SignInIcon /></Box>
                Sign in
              </Button>
            </Box>
          )}
          {!!isSignedIn && (intent === 'claim') && (
            <Box marginTop="auto">
              <Box width="100%" marginBottom="40px">
                <Button
                  width="100%"
                  borderRadius="50px"
                  height="50px"
                  fontSize="16px"
                  fontWeight="bold"
                  onClick={claim}
                >
                  领取礼品
                </Button>
              </Box>
            </Box>
          )}
          {!!isSignedIn && (intent === 'send') && (
            <Box marginTop="auto">
              <Box width="100%" marginBottom="40px">
                <Button
                  width="100%"
                  borderRadius="50px"
                  height="50px"
                  fontSize="16px"
                  fontWeight="bold"
                  onClick={() => setActivePage('send')}
                >
                  发群礼品
                </Button>
              </Box>
              <Box width="100%">
                <Box
                  width="100%"
                  height="50px"
                  fontSize="16px"
                  fontWeight="bold"
                  color="white"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  {`历史记录 >`}
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}
