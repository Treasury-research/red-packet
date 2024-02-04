import { useState, useCallback, useEffect, Fragment } from 'react'
import { Box, Image, Button } from '@chakra-ui/react'
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

export default function Home() {
  const [activePage, setActivePage] = useState('home')
  const [isShowRules, setIsShowRules] = useState(false)
  const [isLogingIn, setIsLogingIn] = useState(false)
  const [account, setAccount] = useState('test')
  const { sdk, connected, connecting, provider, chainId } = useSDK()
  const { userInfo, updateUserInfo, getUserInfo } = useUserStore()
  const isSignedIn = !!userInfo && !!userInfo.token
  console.log('userInfo', userInfo, connecting)

  const connect = async () => {
    try {
      const accounts = await sdk.connect()

      updateUserInfo({
        account: accounts[0]
      })
    } catch(err) {
      console.warn(`failed to connect..`, err)
    }
  }

  const signIn = useCallback(async () => {
    try {
      const userInfo = getUserInfo()
      const { initDataRaw } = userInfo
      const res1 = await api.login({ webAppInitData: `user=%7B%22id%22%3A1960649593%2C%22first_name%22%3A%22T%22%2C%22last_name%22%3A%22T%22%2C%22language_code%22%3A%22zh-hans%22%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=-8465888862239987465&chat_type=group&start_param=test&auth_date=1706944227&hash=5828659d81ad70d033f72569dbdbe98ef0fdf3a84b2003400c28cd0d244f39a5` })
      const { accessToken } = res1
      const res2 = await api.getUserInfo({}, {
        requireAuth: true,
        tokenFetcher: () => accessToken
      })
      console.log('res2', res2)
      updateUserInfo({
        ...res2
      })
      alert(JSON.stringify(res2))
    } catch(err) {
      console.warn(`failed to connect..`, err.message)
    }
  }, [])

  useEffect(() => {

  }, [])

  if (activePage === 'activityRules') {
    return (
      <ActivityRules back={() => setActivePage('home')} />
    )
  }

  if (activePage === 'send') {
    return (
      <Send back={() => setActivePage('home')} />
    )
  }

  if (userInfo && !!userInfo.account && !userInfo.address) {
    return (
      <BindAddress />
    )
  }

  return (
    <Box
      width="100%"
      height="100%"
      background="linear-gradient(to bottom, #0D1320, #0C1845)"
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
              <Button width="100%" borderRadius="50px" height="50px" fontSize="16px" fontWeight="bold" onClick={signIn} loading={isLogingIn} disabled={isLogingIn}>
                <Box marginRight="8px"><SignInIcon /></Box>
                Sign in
              </Button>
            </Box>
          )}
          {!!isSignedIn && (
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
