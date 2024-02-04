import { useState } from 'react'
import { Box, Image, Button, Input } from '@chakra-ui/react'
import LogoIcon from "@/components/Icons/Logo"
import SignInIcon from "@/components/Icons/SignIn"
import BackIcon from "@/components/Icons/Back"
import ArrowDownIcon from "@/components/Icons/ArrowDown"
import GiftImage from "@/assets/images/gift-bg.png"
import { useForm } from 'react-hook-form'
import { useUserStore } from '@/store/user'
import { Popup } from 'react-vant'

export default function Send({ back }) {
  const [isSentSuccess, setIsSentSuccess] = useState(false)
  const [showSelectNetwork, setShowSelectNetwork] = useState(false)
  const [showSelectToken, setShowSelectToken] = useState(false)
  const { userInfo, updateUserInfo, getUserInfo } = useUserStore()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  if (isSentSuccess) {
    return (
      <Box>

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
          padding="0 32px"
          position="relative"
        >
          <Box
            marginRight="auto"
            onClick={back}
            cursor="pointer"
            position="absolute"
            top="0"
            left="32px"
            height="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <BackIcon />
          </Box>
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
            width="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
          >
            <Image src={GiftImage} />
            <Box
              fontSize="18px"
              fontWeight="600"
              color="white"
              marginTop="20px"
              marginBottom="20px"
            >
              TypoGraphy专属礼品
            </Box>
          </Box>
          <Box padding="20px 0">
            <Box
              background="white"
              borderRadius="40px"
              display="flex"
              minHeight="40px"
              alignItems="center"
              justifyContent="space-between"
              padding="0 20px"
              marginBottom="20px"
              cursor="pointer"
              onClick={() => setShowSelectNetwork(!showSelectNetwork)}
            >
              <Box>
                选择网络
              </Box>
              <Box>
                <Box position="relative" paddingRight="20px">
                  Ethereum Mainnet
                  <Box
                    position="absolute"
                    top="0"
                    right="0"
                    height="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <ArrowDownIcon />
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box
              background="white"
              borderRadius="40px"
              display="flex"
              minHeight="40px"
              alignItems="center"
              justifyContent="space-between"
              padding="0 20px"
              marginBottom="8px"
            >
              <Box width="calc(100% - 50px)" display="flex" alignItems="center">
                <Box
                  marginRight="auto"
                  height="100%"
                >
                  总金额
                </Box>
                <Box width="50%">
                  <Input
                    textAlign="right"
                    outline="none"
                    borderWidth="0"
                    boxShadow="none !important"
                    border="none"
                    placeholder="发多少"
                    {...register('amount')}
                  />
                </Box>
              </Box>
              <Box>
                <Box position="relative" paddingRight="20px">
                  BTC
                  <Box
                    position="absolute"
                    top="0"
                    right="0"
                    height="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <ArrowDownIcon />
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box color="#A7A7A9" fontSize="14px" padding="0 20px" marginBottom="14px">可用余额: 8,750.0000000 BTC</Box>
            <Box
              background="white"
              borderRadius="40px"
              display="flex"
              minHeight="40px"
              alignItems="center"
              justifyContent="space-between"
              padding="0 20px"
              marginBottom="8px"
            >
              <Box width="calc(100%)" display="flex" alignItems="center">
                <Box
                  marginRight="auto"
                  height="100%"
                >
                  领取人数
                </Box>
                <Box width="50%">
                  <Input
                    textAlign="right"
                    outline="none"
                    borderWidth="0"
                    boxShadow="none !important"
                    value="20"
                    placeholder="礼品发给几个人"
                    {...register('count')}
                  />
                </Box>
              </Box>
            </Box>
            <Box color="#A7A7A9" fontSize="14px" padding="0 20px" marginBottom="14px">每人领到随机金额，改为 <Box as="span" color="white">平均金额</Box></Box>
            <Box
              background="white"
              borderRadius="10px"
              display="flex"
              minHeight="40px"
              alignItems="center"
              justifyContent="space-between"
              padding="0 20px"
            >
              <Box width="calc(100%)" display="flex" alignItems="center" padding="20px 0">
                <Input
                  marginRight="auto"
                  height="100%"
                  value="祝你发财"
                  outline="0"
                  border="0"
                  padding="0"
                  boxShadow="none !important"
                  {...register('memo')}
                />
              </Box>
            </Box>
          </Box>
          <Box width="100%" marginBottom="40px" marginTop="auto" display="flex" flexDirection="column" alignItems="center">
            <Box fontSize="30px" fontWeight="bold" color="white" marginBottom="10px">1.00 BTC</Box>
            <Button width="100%" borderRadius="50px" height="50px" fontSize="16px" fontWeight="bold">
              发礼品
            </Button>
          </Box>
        </Box>
      </Box>
      <Popup
        visible={showSelectNetwork}
        position="bottom"
        style={{
          borderTopLeftRadius: '10px',
          borderTopRightRadius: '10px',
          //minHeight: '80px'
        }}
        onClose={() => setShowSelectNetwork(false)}
      >
        <Box
          borderRadius="10px"
          overflow="hidden"
        >
          <Box
            width="100%"
            height="20px"
            padding="0"
          />
          <Box
            onClick={() => setShowSelectNetwork(false)}
            width="100%"
            height="44px"
            borderTop="1px solid #D8D8D8"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontWeight="500"
            fontSize="16px"
            cursor="pointer"
            padding="0"
          >
            Cancel
          </Box>
        </Box>
      </Popup>
    </Box>
  )
}
