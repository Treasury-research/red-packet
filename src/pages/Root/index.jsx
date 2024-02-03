import { Box } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom';
import CloseIcon from "@/Components/Icons/Close"
import MoreIcon from "@/Components/Icons/More"
import {
  SDKProvider,
  useMainButton,
  useBackButton,
  useInitData,
  useInitDataRaw,
  DisplayGate,
} from '@tma.js/sdk-react'
import { useEffect, useMemo, useState } from 'react'
import { redPacketApi } from '@/api'
import { useUserStore } from '@/store/user'

function MainButton() {
  const mb = useMainButton()
  const bb = useBackButton()
  const [count, setCount] = useState(0)

  useEffect(() => {
    const removeMainButtonClick = mb.on('click', () => {
      setCount((prevCount) => prevCount + 1)
    })

    const removeBackButtonClick = bb.on('click', () => {
      setCount((prevCount) => prevCount - 1)
    })

    return () => {
      removeMainButtonClick()
      removeBackButtonClick()
    }
  }, [])

  useEffect(() => {
    mb.enable().show()
  }, [])

  useEffect(() => {
    mb.setText(`Count is ${count}`)
  }, [mb, count])

  useEffect(() => {
    if (count === 0) {
      bb.hide()
      return
    }

    bb.show()
  }, [bb, count])

  return null
}

function InitData() {
  const { userInfo, updateUserInfo } = useUserStore()
  const initData = useInitData()
  const initDataRaw = useInitDataRaw()

  useEffect(() => {
    updateUserInfo({
      initDataRaw
    })
  }, [initData])

  useEffect(() => {
    updateUserInfo({
      initDataRaw
    })
  }, [initDataRaw])

  return null
}

function SDKProviderError({ error }) {
  return (
    <div>
      Oops. Something went wrong.
      <blockquote>
        <code>
          {error instanceof Error ? error.message : JSON.stringify(error)}
        </code>
      </blockquote>
    </div>
  )
}

function SDKProviderLoading() {
  return <div>SDK is loading.</div>
}

function SDKInitialState() {
  return <div>Waiting for initialization to start.</div>
}

export default function Root() {
  /* return (
   *   <Box
   *     width="100vw"
   *     height="100vh"
   *     background="black"
   *   >
   *     <Box
   *       position="fixed"
   *       top="0"
   *       left="0"
   *       height="44px"
   *       width="100vw"
   *       background="#212121"
   *       padding="0 24px"
   *       display="flex"
   *       alignItems="center"
   *       justifyContent="flex-start"
   *     >
   *       <Box marginRight="20px" cursor="pointer">
   *         <CloseIcon />
   *       </Box>
   *       <Box
   *         color="white"
   *         fontWeight="600"
   *       >
   *         typobot
   *       </Box>
   *       <Box marginLeft="auto" cursor="pointer">
   *         <MoreIcon />
   *       </Box>
   *     </Box>
   *     <Box paddingTop="44px" height="100%">
   *       <Outlet />
   *     </Box>
   *   </Box>
   * )
   */
  return (
    <SDKProvider options={{ acceptCustomStyles: true, cssVars: true, async: true }}>
      <DisplayGate
        error={SDKProviderError}
        loading={SDKProviderLoading}
        initial={SDKInitialState}
      >
        <Box
          width="100vw"
          height="100vh"
          background="black"
        >
          <Box
            position="fixed"
            top="0"
            left="0"
            height="44px"
            width="100vw"
            background="#212121"
            padding="0 24px"
            display="flex"
            alignItems="center"
            justifyContent="flex-start"
          >
            <Box marginRight="20px" cursor="pointer">
              <CloseIcon />
            </Box>
            <Box
              color="white"
              fontWeight="600"
            >
              typobot
            </Box>
            <Box marginLeft="auto" cursor="pointer">
              <MoreIcon />
            </Box>
          </Box>
          <Box paddingTop="44px" height="100%">
            <Outlet />
          </Box>
        </Box>
        {/* <MainButton /> */}
        <InitData />
      </DisplayGate>
    </SDKProvider>
  )
}
