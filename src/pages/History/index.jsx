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
import Screen from '@/components/Screen'

export const toShortAddress = (address, firstSlice = 6, lastSlice = 4) => {
  if (address.length > 10) {
    return `${address.slice(0, firstSlice)}...${address.slice(-lastSlice)}`
  }

  return address
}

function HistoryList({ list }) {
  const [activeSection, setActiveSection] = useState('receive')
  const list1 = list || []
  const list2 = []
  console.log('list1', list1)

  return (
    <Box padding="20px 40px">
      <Box display="flex" fontSize="14px">
        <Box
          color="black"
          cursor="pointer"
          padding="0 5px"
          borderBottom="1px solid black"
          marginRight="10px"
        >
          我收到的
        </Box>
        <Box
          color="#7A7A7E"
          cursor="pointer"
          padding="0 5px"
        >
          我发出的
        </Box>
      </Box>
      <Box
        width="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100px"
        color="#7A7A7E"
      >
        共收到<Box color="black" fontWeight="bold">{list1.length}</Box>份礼物
      </Box>
      <Box
        marginTop="0px"
      >
        {list1.map(item =>
          <Box display="flex" cursor="pointer" key={item.id}>
            <Box>

            </Box>
            <Box marginRight="auto">
              <Box color="#222228" fontSize="14px">{toShortAddress(item.claimer)}</Box>
              <Box color="#A7A7A9" fontSize="12px">{item.created_at}</Box>
            </Box>
            <Box paddingRight="14px">
              <Box color="#222228" fontSize="14px">{item.claimed_value}</Box>
              <Box color="#A7A7A9" fontSize="12px">已领取</Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default function History({ onBack }) {
  const [history, setHistory] = useState([])
  const [loaded, setLoaded] = useState(false)

  const {
    userInfo,
    updateUserInfo,
    getUserInfo,
    clearUserStore
  } = useUserStore()

  useEffect(() => {
    const main = async () => {
      const token = userInfo.token

      const res = await api.getClaimHistory({
        pageNumber: 0,
        pageSize: 20
      }, {
        requireAuth: true,
        tokenFetcher: () => token
      })
      setHistory(res.data)
      console.log('getClaimHistory', res.data)
      setLoaded(true)
    }

    main()
  }, [])

  return (
    <Screen onBack={onBack} title="历史记录">
      <Box
        width="100%"
        height="100%"
        background="white"
      >
        {!loaded && (
          <Box
            color="black"
            display="flex"
            alignItems="center"
            justifyContent="center"
            padding="20px"
          >
            Loading...
          </Box>
        )}
        {!!loaded && history && <HistoryList list={history} />}
      </Box>
    </Screen>
  )
}
