import { useState, useCallback, useEffect, Fragment } from 'react'
import { Box, Image, Button, useToast, Spinner } from '@chakra-ui/react'
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
import Screen from '@/components/Screen'

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

  const connect = async () => {
    try {
      const accounts = await sdk.connect()

      updateUserInfo({
        account: accounts[0]
      })
    } catch(err) {
      toast({
        status: 'error',
        title: err.message,
      });
      console.warn(`failed to connect..`, err)
    }
  }

  useEffect(() => {
    const { startParam } = userInfo

    if (startParam) {
      alert(`startParam:${startParam}`)
      const params = startParam.split('_')

      if (params[0]) {
        setIntent('send')
        updateUserInfo({
          chatId: params[0]
        })
      } else if (params[1]) {
        setIntent('claim')
        updateUserInfo({
          redPacketId: params[1]
        })
      }
    }
  }, [userInfo.startParam])

  const signIn = useCallback(async () => {
    try {
      setIsLogingIn(true)
      // await sdk.connect()
      const userInfo = getUserInfo()
      let { initDataRaw } = userInfo
      initDataRaw = `user=%7B%22id%22%3A1960649593%2C%22first_name%22%3A%22T%22%2C%22last_name%22%3A%22T%22%2C%22language_code%22%3A%22zh-hans%22%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=-8465888862239987465&chat_type=group&start_param=test&auth_date=1706944227&hash=5828659d81ad70d033f72569dbdbe98ef0fdf3a84b2003400c28cd0d244f39a5`
      const res1 = await api.login({ webAppInitData: initDataRaw })
      const { accessToken } = res1
      const res2 = await api.getUserInfo({}, {
        requireAuth: true,
        tokenFetcher: () => accessToken
      })
      console.log('res2', res2)
      updateUserInfo({
        ...res2,
        token: accessToken
      })

      setIsLogingIn(false)
      toast({
        status: 'success',
        title: 'Login Success!',
      });
    } catch(err) {
      setIsLogingIn(false)
      toast({
        status: 'error',
        title: err.message,
      });
    }
  }, [sdk])

  const claim = useCallback(async (data) => {
    try {
      setIsClaiming(true)
      await sdk.connect()
      const { amount, count, memo } = data
      const token = userInfo.token
      const redPacketId = userInfo.redPacketId
      alert(redPacketId)

      const message = await api.sign({
        id: redPacketId,
        address: `0xb864163E3491F7cabaBFbABAF94eF3034572594d`
      }, {
        requireAuth: true,
        tokenFetcher: () => token
      })
      console.log('message', message)

      await sdk.connect()
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()

      const address = '0xffdab174499b6515624f1043205cf21879f170a5';
      const abi = [
        `function claim(bytes32 id, bytes signedMsg, address recipient) returns (uint256 claimed)`
      ];

      const contract = new ethers.Contract(address, abi, signer);
      const tx = await contract.claim(
        redPacketId,
        message,
        `0xb864163E3491F7cabaBFbABAF94eF3034572594d`
      );

      const receipt = await tx.wait();
      console.log("receipt", receipt);
      setIsClaiming(false)
      toast({
        status: 'success',
        title: 'Claim Success!',
      });
    } catch (error) {
      setIsClaiming(false)
      console.log('error', error.message)
      toast({
        status: 'error',
        title: error.message,
      });
    }
  }, [userInfo])

  if (activePage === 'activityRules') {
    return (
      <ActivityRules onBack={() => setActivePage('home')} />
    )
  }

  if (userInfo && userInfo.token && !userInfo.address) {
    return (
      <BindAddress onBack={() => setActivePage('home')} />
    )
  }

  if (activePage === 'send') {
    return (
      <Send onBack={() => setActivePage('home')} />
    )
  }

  const disabled = isLogingIn
  const loading = isLogingIn

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
              {loading && <Box display="inline" marginRight="10px"><Spinner /></Box>}
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
          <Box marginTop="auto" marginBottom="20px">
            <Box width="100%" marginBottom="10px">
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
                cursor="pointer"
              >
                {`历史记录 >`}
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Screen>
  )
}
