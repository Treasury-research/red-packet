import { useState, useCallback, useEffect } from 'react'
import { Box, Image, Button, Input } from '@chakra-ui/react'
import LogoIcon from "@/components/Icons/Logo"
import SignInIcon from "@/components/Icons/SignIn"
import BackIcon from "@/components/Icons/Back"
import ArrowDownIcon from "@/components/Icons/ArrowDown"
import GiftImage from "@/assets/images/gift-bg.png"
import { useForm } from 'react-hook-form'
import { useUserStore } from '@/store/user'
import { Popup } from 'react-vant'
import { ethers, BrowserProvider } from 'ethers'
import { useSDK } from '@metamask/sdk-react'

export default function Send({ back }) {
  const [tokenInfo, setTokenInfo] = useState()
  const [networkInfo, setNetworkInfo] = useState()
  const [isSentSuccess, setIsSentSuccess] = useState(false)
  const [showSelectNetwork, setShowSelectNetwork] = useState(false)
  const [showSelectToken, setShowSelectToken] = useState(false)
  const { userInfo, updateUserInfo, getUserInfo } = useUserStore()
  const [submiting, setSubmiting] = useState(false)
  const { provider: metamaskProvider, sdk } = useSDK()
  const form = useForm()
  const {
    register,
    handleSubmit,
    formState,
    getValues,
  } = form

  const selectNetwork = useCallback((info) => {
    setNetworkInfo(info)
    setShowSelectNetwork(false)
  }, [])

  const selectToken = useCallback((info) => {
    setTokenInfo(info)
    setShowSelectToken(false)
  }, [])

  const onSubmit = useCallback(async (data) => {
    const provider = new ethers.BrowserProvider(metamaskProvider)
    const signer = await provider.getSigner()
    const address = "0xffdab174499b6515624f1043205cf21879f170a5";
    const abi = [
      "function create_red_packet(uint256 _number, bool _ifrandom, uint256 _duration, bytes32 _seed, string _message, string _name, uint256 _token_type, address _token_addr, uint256 _total_tokens, string _chat_id) payable"
    ];
    const contract = new ethers.Contract(address, abi, signer);
    const tx = await contract.functions.create_red_packet(
      1,
      1,
      300,
      '0xb4ea3b98caa0037b5a71b6a10179f2be9f9f3c3e1ce6e2ab635c1e07169cbd49',
      11,
      22,
      1,
      '0xD93658903F051092fC065415e721DF6f57fBe9Bb',
      '1000000',
      '-4050289260'
    )

    const receipt = await tx.wait();
    console.log("receipt", receipt);

    console.log('onSubmit', signer)
  }, [networkInfo, tokenInfo, metamaskProvider])

  useEffect(() => {

  }, [])

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
          <form onSubmit={handleSubmit(onSubmit)}>
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
                onClick={() => setShowSelectNetwork(true)}
              >
                <Box>
                  选择网络
                </Box>
                <Box>
                  <Box position="relative" paddingRight="20px">
                    {(networkInfo && networkInfo.name) ? (
                      <Box>{networkInfo.name}</Box>
                    ) : (
                      <Box color="#A7A7A9">请选择</Box>
                    )}
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
                <Box width="calc(100% - 80px)" display="flex" alignItems="center">
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
                  <Box
                    position="relative"
                    paddingRight="20px"
                    onClick={() => setShowSelectToken(true)}
                    cursor="pointer"
                  >
                    {(tokenInfo && tokenInfo.name) ? (
                      <Box>{tokenInfo.name}</Box>
                    ) : (
                      <Box color="#A7A7A9">请选择</Box>
                    )}
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
              <Box color="#A7A7A9" fontSize="14px" padding="0 20px" marginBottom="14px">可用余额: 0.0000000 {tokenInfo && tokenInfo.symbol}</Box>
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
              <Box fontSize="30px" fontWeight="bold" color="white" marginBottom="10px">{getValues('amount') || '0.0000'} {tokenInfo && tokenInfo.symbol}</Box>
              <Button width="100%" borderRadius="50px" height="50px" fontSize="16px" fontWeight="bold" type="submit">
                发礼品
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
      <Popup
        visible={showSelectNetwork}
        position="bottom"
        style={{
          borderTopLeftRadius: '10px',
          borderTopRightRadius: '10px',
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
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Box
              width="40px"
              height="4px"
              borderRadius="4px"
              background="#ccc"
            />
          </Box>
          <Box>
            <Box
              onClick={() => selectNetwork({ name: 'Mumbai' })}
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
              Mumbai
            </Box>
          </Box>
          <Box
            onClick={() => setShowSelectNetwork(false)}
            width="100%"
            height="44px"
            borderTop="2px solid #D8D8D8"
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
      <Popup
        visible={showSelectToken}
        position="bottom"
        style={{
          borderTopLeftRadius: '10px',
          borderTopRightRadius: '10px',
        }}
        onClose={() => setShowSelectToken(false)}
      >
        <Box
          borderRadius="10px"
          overflow="hidden"
        >
          <Box
            width="100%"
            height="20px"
            padding="0"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Box
              width="40px"
              height="4px"
              borderRadius="4px"
              background="#ccc"
            />
          </Box>
          <Box>
            <Box
              onClick={() => selectToken({ name: 'Test', symbol: 'Test' })}
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
              Test
            </Box>
          </Box>
          <Box
            onClick={() => setShowSelectToken(false)}
            width="100%"
            height="44px"
            borderTop="2px solid #D8D8D8"
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
