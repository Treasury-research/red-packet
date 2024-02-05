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
  const { userInfo, updateUserInfo, getUserInfo, clearUserStore } = useUserStore()
  const [submiting, setSubmiting] = useState(false)
  const { provider: metamaskProvider, sdk } = useSDK()
  const form = useForm()
  const {
    register,
    handleSubmit,
    formState,
    getValues,
  } = form

  useEffect(() => {
    clearUserStore()
  }, [])

  const switchNetwork = useCallback(async () => {
    // 'Mumbai'
    setShowSelectNetwork(false)
    const ethereum = metamaskProvider
    const networkInfo = {
      chainId: '0x13881',
      chainName: 'Mumbai',
      rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
      currencySymbol: 'MATIC'
    }

    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x13881' }],
      })

      setNetworkInfo(networkInfo)
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [networkInfo],
          })

          setNetworkInfo(networkInfo)
        } catch (addError) {
          // handle "add" error
        }
      }
      // handle other "switch" errors
    }
  }, [metamaskProvider])

  const selectNetwork = useCallback((info) => {
    setNetworkInfo(info)
    setShowSelectNetwork(false)
  }, [])

  const selectToken = useCallback((info) => {
    setTokenInfo(info)
    setShowSelectToken(false)
  }, [])

  async function approve(address, amount, signer) {
    const contractAddress = "0xC666283f0A53C46141f509ed9241129622013d95";
    const abi = [
      "function approve(address _spender, uint256 _value) returns (bool)"
    ];

    const contract = new ethers.Contract(contractAddress, abi, signer);
    const tx = await contract.approve(address, amount);

    const receipt = await tx.wait();
    console.log("approve receipt", receipt);
  }

  const onSubmit = useCallback(async (data) => {
    try {
      await sdk.connect()
      const provider = new ethers.BrowserProvider(metamaskProvider)
      const signer = await provider.getSigner()

      const address = "0xffdab174499b6515624f1043205cf21879f170a5";
      await approve(address, '1000000', signer)

      const abi = [
        "function create_red_packet(uint256 _number, bool _ifrandom, uint256 _duration, bytes32 _seed, string _message, string _name, uint256 _token_type, address _token_addr, uint256 _total_tokens, string _chat_id) payable"
      ];
      const contract = new ethers.Contract(address, abi, signer);
      console.log('contract', contract.create_red_packet)
      const tx = await contract.create_red_packet(
        1,
        1,
        60 * 60 * 24,
        '0xb4ea3b98caa0037b5a71b6a10179f2be9f9f3c3e1ce6e2ab635c1e07169cbd49',
        'hello',
        'red packet',
        1,
        '0xC666283f0A53C46141f509ed9241129622013d95',
        '1000000',
        '-4050289260'
      )

      const receipt = await tx.wait();
      console.log("receipt", receipt);
    } catch (error) {
      console.log('error', error.message)
    }
  }, [networkInfo, tokenInfo, metamaskProvider])

  useEffect(() => {

  }, [])
  /*
   *   if (isSentSuccess) {
   *     return (
   *       <Box>
   *
   *       </Box>
   *     )
   *   }
   *  */
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
                    {(networkInfo && networkInfo.chainName) ? (
                      <Box>{networkInfo.chainName}</Box>
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
                <Box width="calc(100% - 60px)" display="flex" alignItems="center">
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
                <Box width="70px">
                  <Box
                    position="relative"
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
              <Box
                color="#A7A7A9"
                fontSize="14px"
                padding="0 20px"
                marginBottom="14px"
              >
                可用余额: 0.0000000 {tokenInfo && tokenInfo.symbol}
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
                <Box width="calc(100%)" display="flex" alignItems="center">
                  <Box
                    height="100%"
                    width="80px"
                  >
                    领取人数
                  </Box>
                  <Box width="calc(100% - 80px)">
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
                    placeholder="备注"
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
              onClick={switchNetwork}
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
