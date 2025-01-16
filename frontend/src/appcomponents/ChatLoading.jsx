import React from 'react'
import { HStack, Stack, VStack } from "@chakra-ui/react"
import { Skeleton } from "@/components/ui/skeleton"
import { Text } from "@chakra-ui/react"
function ChatLoading() {
  return (
    <Stack>
    <HStack gap="5">
        <Text width="8ch">p</Text>
        <Skeleton flex="1" height="5" variant="pulse" />
      </HStack>
      <HStack gap="5">
        <Text width="8ch"></Text>
        <Skeleton flex="1" height="5" variant="shine" />
      </HStack>
      <HStack gap="5">
        <Text width="8ch"></Text>
        <Skeleton flex="1" height="5" variant="pulse" />
      </HStack>
      <HStack gap="5">
        <Text width="8ch"></Text>
        <Skeleton flex="1" height="5" variant="shine" />
      </HStack>
  </Stack>
  )
}

export default ChatLoading
