import { Box } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom';
import CloseIcon from "@/Components/Icons/Close"
import MoreIcon from "@/Components/Icons/More"

export default function Root() {
  return (
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
  )
}
