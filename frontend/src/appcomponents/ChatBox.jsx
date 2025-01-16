import React from 'react'
import { ChatState } from '@/Context/ChatProvider'
import SingleChat from './SingleChat';
import { Box } from '@chakra-ui/react'
function ChatBox({fetchAgain,setFetchAgain}) {
  const {selectedChat}=ChatState();
  return (
    <Box
    display={{base:selectedChat?"flex":"none",md:"flex"}}
    alignItems={"center"}
    flexDirection={"column"}
    p={3}
    background={"white"}
    width={{base:"100%",md:"60%"}}
    borderRadius={"lg"}
    borderWidth={"1px"}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </Box>
  )
}

export default ChatBox
