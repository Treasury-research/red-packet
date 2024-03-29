import { Box } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom';
import CloseIcon from "@/components/Icons/Close"
import MoreIcon from "@/components/Icons/More"
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

const SelectNetworkModal = () => {
  return (
    <Box>

    </Box>
  )
}

const SelectTokenModal = () => {
  return (
    <Box>

    </Box>
  )
}

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
      startParam: initData.startParam
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
   *     background="black"
   *     position="fixed"
   *     width="100%"
   *     height="100%"
   *     top="0"
   *     left="0"
   *     background="linear-gradient(to bottom, #0D1320, #0C1845)"
   *   >
   *     <Box height="100%">
   *       <Outlet />
   *     </Box>
   *   </Box>
   * ) */

  return (
    <SDKProvider options={{ acceptCustomStyles: true, cssVars: true, async: true }}>
      <DisplayGate
        error={SDKProviderError}
        loading={SDKProviderLoading}
        initial={SDKInitialState}
      >
        <Box
          position="fixed"
          width="100%"
          height="100%"
          top="0"
          left="0"
          overflowY="scroll"
          background="linear-gradient(to bottom, #0D1320, #0C1845)"
        >
          <Box height="100%" overflowY="scroll">
            <Outlet />
          </Box>
        </Box>
        {/* <MainButton /> */}
        <InitData />
      </DisplayGate>
    </SDKProvider>
  )
}
