import { useState, useCallback, useEffect, Fragment } from 'react'
import { Box, Image, Button, useToast } from '@chakra-ui/react'
import BackIcon from "@/components/Icons/Back"

export default function Screen({ children, onBack, title }) {
  console.log('onBack', onBack, title)
  return (
    <Box
      width="100%"
      height="100%"
      position="relative"
    >
      <Box
        position="fixed"
        top="0"
        left="0"
        color="white"
        width="100%"
        height="44px"
        zIndex="2"
      >
        {onBack && (
          <Box
            marginRight="auto"
            onClick={onBack}
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
        )}
        <Box
          width="100%"
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {title || ``}
        </Box>
      </Box>
      <Box
        width="100%"
        height="100%"
        marginTop="44px"
        overflowY="scroll"
      >
        {children}
      </Box>
    </Box>
  )
}
