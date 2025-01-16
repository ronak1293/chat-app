import React from 'react'
import { Button } from "@/components/ui/button"
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Box } from '@chakra-ui/react'
import { FaEye } from "react-icons/fa";
import { Image } from '@chakra-ui/react';
import { Text } from '@chakra-ui/react';
function ProfileModal({user}) {
  return (
    <Box>
       <DialogRoot>
      <DialogTrigger asChild>
      <FaEye style={{cursor:"pointer"}} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user.name}</DialogTitle>
        </DialogHeader>

<DialogBody>
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    padding="4"
    borderRadius="md"
    background="gray.50"
    boxShadow="md"
    width="100%"
    maxW="sm"
    margin="auto"
  >
    <Image
      src={user.pic}
      alt="User Pic"
      borderRadius="full"
      boxSize="100px"
      objectFit="cover"
      mb="3"
      border="2px solid #3182CE"
    />
    <Text fontSize="lg" fontWeight="bold" color="gray.700">
      {user.email}
    </Text>
  </Box>
</DialogBody>

        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </DialogActionTrigger>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
    </Box>
  )
}

export default ProfileModal
