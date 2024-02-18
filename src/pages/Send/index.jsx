import { useState, useCallback, useEffect } from 'react'
import { Box, Image, Button, Input, useToast, Spinner } from '@chakra-ui/react'
import LogoIcon from "@/components/Icons/Logo"
import SignInIcon from "@/components/Icons/SignIn"
import BackIcon from "@/components/Icons/Back"
import ArrowDownIcon from "@/components/Icons/ArrowDown"
import GiftImage from "@/assets/images/gift-bg.png"
import { useForm, Controller } from 'react-hook-form'
import { useUserStore } from '@/store/user'
import { Popup } from 'react-vant'
import { ethers, BrowserProvider } from 'ethers'
import { useSDK } from '@metamask/sdk-react'
import * as api from '@/api'
import { networkList } from '@/config'
import Screen from '@/components/Screen'

const numberRe = (decimalPlaces) => decimalPlaces ? new RegExp(`^\\s*(\\d+(\\.(\\d{1,${decimalPlaces}})?)?|(\\.\\d{1,${decimalPlaces}}))\\s*$`) : new RegExp(`^\\s*(\\d+)\\s*$`)
const validateUnit = (value, decimalPlaces) => (!!value && !!value.trim() && numberRe(decimalPlaces).test(value))
export const validateUnitByFraction = (fraction) => (value) => validateUnit(value, fraction)

export default function Send() {
  const [networkInfo, setNetworkInfo] = useState()
  const [tokenInfo, setTokenInfo] = useState()
  const [isSentSuccess, setIsSentSuccess] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [showSelectNetwork, setShowSelectNetwork] = useState(false)
  const [showSelectToken, setShowSelectToken] = useState(false)
  const { userInfo, updateUserInfo, getUserInfo, clearUserStore } = useUserStore()
  const [submiting, setSubmiting] = useState(false)
  const [displayAmount, setDisplayAmount] = useState(0)
  const { provider: metamaskProvider, sdk } = useSDK()
  const toast = useToast();
  const form = useForm({
    reValidateMode: 'onChange',
    mode: 'onChange',
  })
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
    control,
    trigger,
    reset,
    watch,
  } = form

  const disabled = !isValid || !!isSending

  console.log('errors', errors, isValid)

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === 'amount') {
        console.log('setDisplayAmount', value)
        setDisplayAmount(value[name])
      }
    })

    return () => subscription.unsubscribe()
  }, [watch])

  useEffect(() => {
    sdk.connect()
  }, [])

  const switchNetwork = useCallback(async (networkInfo) => {
    const {
      chainId,
      chainName,
      rpcUrls,
      currencySymbol,
      currencyDecimal
    } = networkInfo

    setShowSelectNetwork(false)
    // await sdk.connect()
    const ethereum = window.ethereum

    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      })

      setNetworkInfo(networkInfo)
    } catch (switchError) {
      if (switchError.code === 4902 || switchError.message.indexOf('Try add') !== -1) {
        try {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: networkInfo.chainId,
              chainName: networkInfo.chainName,
              rpcUrls: networkInfo.rpcUrls,
              nativeCurrency: {
                name: networkInfo.currencySymbol,
                symbol: networkInfo.currencySymbol,
                decimals: networkInfo.currencyDecimal
              }
            }],
          })

          setNetworkInfo(networkInfo)
        } catch (error) {
          toast({
            status: 'error',
            title: error.message,
          });
        }
      } else {
        toast({
          status: 'error',
          title: switchError.message,
        });
      }
    }
  }, [])

  const switchToken = useCallback((tokenInfo) => {
    setTokenInfo(tokenInfo)
    setShowSelectToken(false)
  }, [])

  const approve = useCallback(async (address, amount, signer) => {
    const contractAddress = tokenInfo.contractAddress
    const abi = [
      `function approve(address _spender, uint256 _value) returns (bool)`
    ]
    const contract = new ethers.Contract(contractAddress, abi, signer)
    const tx = await contract.approve(address, amount)
    const receipt = await tx.wait()
    console.log("approve receipt", receipt)
  }, [tokenInfo])

  const getTokenDecimal = useCallback(() => {
    return tokenInfo ? tokenInfo.decimal : 0
  }, [tokenInfo])

  const onSubmit = useCallback(async (data) => {
    const { amount, count, memo } = data

    try {
      setIsSending(true)
      // await sdk.connect()

      if (!tokenInfo.isNative) {
        const { amount, count, memo } = data
        const amountInDecimal = ethers.parseUnits(amount, tokenInfo.decimal)
        console.log('amountInDecimal kkk', amountInDecimal)

        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()

        const address = "0xffdab174499b6515624f1043205cf21879f170a5";
        await approve(address, amountInDecimal, signer)

        const abi = [
          "function create_red_packet(uint256 _number, bool _ifrandom, uint256 _duration, bytes32 _seed, string _message, string _name, uint256 _token_type, address _token_addr, uint256 _total_tokens, string _chat_id) payable"
        ];
        const contract = new ethers.Contract(address, abi, signer);
        const tx = await contract.create_red_packet(
          count,
          1,
          60 * 60 * 24,
          '0xb4ea3b98caa0037b5a71b6a10179f2be9f9f3c3e1ce6e2ab635c1e07169cbd49',
          memo,
          'red packet',
          1,
          tokenInfo.contractAddress,
          amountInDecimal,
          '-4050289260'
        )

        const receipt = await tx.wait()
        console.log("receipt", receipt)
      } else {
        const amountInDecimal = ethers.parseEther(amount)
        console.log('amountInDecimal', amountInDecimal)

        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()

        const address = "0xffdab174499b6515624f1043205cf21879f170a5";

        const abi = [
          "function create_red_packet(uint256 _number, bool _ifrandom, uint256 _duration, bytes32 _seed, string _message, string _name, uint256 _token_type, address _token_addr, uint256 _total_tokens, string _chat_id) payable"
        ]
        const contract = new ethers.Contract(address, abi, signer)
        const tx = await contract.create_red_packet(
          count,
          1,
          60 * 60 * 24,
          '0xb4ea3b98caa0037b5a71b6a10179f2be9f9f3c3e1ce6e2ab635c1e07169cbd49',
          memo,
          'red packet',
          0,
          tokenInfo.contractAddress,
          amountInDecimal,
          '-4050289260',
          {
            value: amountInDecimal
          }
        )

        const receipt = await tx.wait()
        console.log("receipt", receipt)
      }

      setIsSending(false)
      reset()
      setIsSentSuccess(true)
      toast({
        status: 'success',
        title: 'Send Success!',
      });
    } catch (error) {
      setIsSending(false)
      console.log('error', error.message)
      toast({
        status: 'error',
        title: error.message.slice(0, 50),
      });
    }
  }, [networkInfo, tokenInfo])

  return (
    <Screen>
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
                    {...register('amount', {
                      validate: (value) => {
                        if (!(/^\s*[+-]?(\d+|\d*\.\d+|\d+\.\d*)([Ee][+-]?\d+)?\s*$/.test(value))) {
                          return 'Invalid amount'
                        }

                        return null
                      }
                    })}
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
            {errors.amount && (
              <Box
                color="red"
                fontSize="14px"
                padding="0 20px"
                marginBottom="14px"
                textAlign="right"
              >
                {errors.amount.message}
              </Box>
            )}
            <Box
              color="#A7A7A9"
              fontSize="14px"
              padding="0 20px"
              marginBottom="14px"
            >
              可用余额: 0 {tokenInfo && tokenInfo.symbol}
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
                    {...register('count', {
                      validate: (value) => {
                        if (!value || !(/^\d*$/.test(value))) {
                          return 'Invalid number'
                        }

                        return null
                      }
                    })}
                    />
                </Box>
              </Box>
            </Box>
            {errors.count && (
              <Box
                color="red"
                fontSize="14px"
                padding="0 20px"
                marginBottom="14px"
                textAlign="right"
              >
                {errors.count.message}
              </Box>
            )}
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
                  {...register('memo', {
                    validate: (value) => {
                      if (value && value.length > 50) {
                        return 'The memo is too long.'
                      }

                      return null
                    }
                  })}
                  />
              </Box>
            </Box>
            {errors.memo && (
              <Box
                color="red"
                fontSize="14px"
                padding="0 20px"
                marginBottom="14px"
                marginTop="6px"
              >
                {errors.memo.message}
              </Box>
            )}
          </Box>
          <Box width="100%" marginBottom="40px" marginTop="auto" display="flex" flexDirection="column" alignItems="center">
            <Box fontSize="30px" fontWeight="bold" color="white" marginBottom="10px">{displayAmount || '0'} {tokenInfo && tokenInfo.symbol}</Box>
            <Button
              width="100%"
              borderRadius="50px"
              height="50px"
              fontSize="16px"
              fontWeight="bold"
              type="submit"
              marginBottom="20px"
              disabled={disabled}
              opacity={disabled ? '0.5' : '1'}
              loading={isSending}
            >
              {isSending && <Box display="inline" marginRight="10px"><Spinner /></Box>}
              发礼品
            </Button>
          </Box>
        </form>
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
          {networkList.map((network) =>
            <Box
              key={network.chainId}
            >
              <Box
                onClick={() => switchNetwork(network)}
                width="100%"
                height="44px"
                borderBottom="1px solid #D8D8D8"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontWeight="500"
                fontSize="16px"
                cursor="pointer"
                padding="0"
              >
                {network.chainName}
              </Box>
            </Box>
          )}
          <Box
            onClick={() => setShowSelectNetwork(false)}
            width="100%"
            height="44px"
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
          {networkInfo && networkInfo.tokenList.map((token) =>
            <Box
              key={token.contractAddress}
            >
              <Box
                onClick={() => switchToken(token)}
                width="100%"
                height="44px"
                borderBottom="1px solid #D8D8D8"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontWeight="500"
                fontSize="16px"
                cursor="pointer"
                padding="0"
              >
                {token.name}
              </Box>
            </Box>
          )}
          <Box
            onClick={() => setShowSelectToken(false)}
            width="100%"
            height="44px"
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
    </Screen>
  )
}
