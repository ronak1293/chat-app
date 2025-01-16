import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ChatState } from '@/Context/ChatProvider'
import { Box } from '@chakra-ui/react';
import SideDrawer from '@/appcomponents/miss/SideDrawer';
import MyChats from '@/appcomponents/MyChats';
import ChatBox from '@/appcomponents/ChatBox';

function Chat() {
  const {user}=ChatState();
  const [fetchAgain,setFetchAgain]=useState(false);
  return (
    <div style={{width:'100%'}}>
      {user&&<SideDrawer/>}
      <Box
      display="flex"
      justifyContent="space-between"
      w="100%"
      h="91.5vh"
      p='10px'
      >
        {user&&<MyChats fetchAgain={fetchAgain} />}
        {user&&<ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      </Box>
      
    </div>
  )
}

export default Chat
