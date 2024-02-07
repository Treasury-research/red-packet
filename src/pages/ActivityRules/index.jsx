import { useState, useCallback, useEffect } from 'react'
import { Box, Image, Button } from '@chakra-ui/react'
import LogoIcon from "@/components/Icons/Logo"
import SignInIcon from "@/components/Icons/SignIn"
import BackIcon from "@/components/Icons/Back"
import GiftImage from "@/assets/images/gift.png"
import { useSDK } from '@metamask/sdk-react'
import { redPacketApi } from '@/api'
import { useUserStore } from '@/store/user'
import * as api from '@/api'

export default function ActivityRules({ back }) {
  return (
    <Box
      width="100%"
      height="100%"
      position="relative"
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        color="white"
        width="100%"
        height="44px"
        zIndex="2"
      >
        <Box
          width="100%"
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          padding="0 32px"
        >
          <Box marginRight="auto" onClick={back} cursor="pointer">
            <BackIcon />
          </Box>
        </Box>
      </Box>
      <Box
        width="100%"
        height="100%"
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
        <Box
          width="100%"
          height="calc(100% - 150px)"
          background="white"
          padding="24px"
          overflowY="scroll"
        >
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
