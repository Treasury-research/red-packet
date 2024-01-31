import { useState } from 'react'
import { Box, Image, Button } from '@chakra-ui/react'
import LogoIcon from "@/Components/Icons/Logo"
import SignInIcon from "@/Components/Icons/SignIn"
import BackIcon from "@/Components/Icons/Back"
import GiftImage from "@/assets/images/gift.png"
import { useSDK } from '@metamask/sdk-react'

export default function Home() {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [isShowRules, setIsShowRules] = useState(false)
  const [account, setAccount] = useState('test')
  const { sdk, connected, connecting, provider, chainId } = useSDK()

  const connect = async () => {
    try {
      const accounts = await sdk.connect()
      console.log('accounts', accounts)
      setAccount(accounts[0])
      atler('Connected Account:', account)
    } catch(err) {
      console.warn(`failed to connect..`, err)
    }
  }

  console.log('account', account)

  if (isShowRules) {
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
            padding="0 32px"
          >
            <Box marginRight="auto" onClick={() => setIsShowRules(false)}>
              <BackIcon />
            </Box>
          </Box>
        </Box>
        <Box
          width="100%"
          height="100%"
          paddingTop="44px"
        >
          <Box
            width="100%"
            height="150px"
            padding="40px"
            display="flex"
            justifyContent="space-between"
          >
            <Box>
              <Box color="white" fontSize="26px">活动规则</Box>
              <Box color="white" fontSize="16px">xxxxxxxxxxxxxxxxxx</Box>
            </Box>
            <Box>
              <Image src={GiftImage} />
            </Box>
          </Box>
          <Box width="100%" height="100%" background="white" padding="24px">
            <Box fontSize="14px" color="#4E4E53" marginBottom="12px">1. xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</Box>
            <Box fontSize="14px" color="#4E4E53" marginBottom="12px">2.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</Box>
            <Box fontSize="14px" color="#4E4E53" marginBottom="12px">3.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</Box>
            <Box fontSize="14px" color="#4E4E53" marginBottom="12px">4.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</Box>
            <Box fontSize="14px" color="#4E4E53" marginBottom="12px">5.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</Box>
          </Box>
        </Box>
      </Box>
    )
  }

  if (!isSignedIn) {
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
            Digital gifts ({account})
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
                <Box color="white" onClick={() => setIsShowRules(true)}>{`活动规则>`}</Box>
                <Box>
                  <Image src={GiftImage} />
                </Box>
              </Box>
            </Box>
            <Box width="100%" marginBottom="40px" marginTop="auto">
              <Button width="100%" borderRadius="50px" height="50px" fontSize="16px" fontWeight="bold" onClick={connect} loading={connecting} disabled={connecting}>
                <Box marginRight="8px"><SignInIcon /></Box>
                Sign in
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
              <Box color="white" onClick={() => setIsShowRules(true)}>{`活动规则>`}</Box>
              <Box>
                <Image src={GiftImage} />
              </Box>
            </Box>
          </Box>
          <Box width="100%" marginBottom="40px" marginTop="auto">
            <Button width="100%" borderRadius="50px" height="50px" fontSize="16px" fontWeight="bold">
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
      </Box>
    </Box>
  )
}
