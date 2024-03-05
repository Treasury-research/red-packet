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

        </Box>
      </Box>
    </Box>
  )
}
