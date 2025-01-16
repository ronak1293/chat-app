import { ChatState } from '@/Context/ChatProvider';
import { CiCirclePlus } from "react-icons/ci";
import { Box } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect,useState } from 'react'
import { Button } from '@/components/ui/button';
import ChatLoading from './ChatLoading';
import { Stack } from '@chakra-ui/react';
import { Text } from '@chakra-ui/react';
import { getSender } from '@/config/ChatLogics';
import GroupChatModal from './miss/GroupChatModal';

function MyChats({fetchAgain}) {
  const [loggedUser,setLoggedUser]=useState();
  const {selectedChat,setSelectedChat,user,chats,setChats}=ChatState();

  const fetchChats=async ()=>{
    try {
      const config={
        headers:{
          Authorization:`Bearer ${user.token}`
        }
      }
  
      const {data}=await axios.get("/api/chat",config);
      setChats(data);
      console.log(data);
      
  
    } catch (error) {
      alert('error occured');
    }
  }
 

  useEffect(()=>{
    setLoggedUser(JSON.parse(localStorage.getItem('userInfo')))
    fetchChats();
  },[fetchAgain])
  return (
    <Box display={{base:selectedChat?"none":"flex",md:"flex"}}
    flexDirection={"column"}
    alignItems={"center"}
    p={3}
    bg={"white"}
    w={{base:"100%",md:"31%"}}
    borderRadius={"lg"}
    borderWidth={"1px"}
    >
      <Box
      pb={3}
      px={3}
      fontSize={{base:"28px",md:"30px"}}
      fontFamily={"Work sans"}
      display={"flex"}
      w={"100%"}
      justifyContent={"space-between"}
      alignItems={"center"}
      color={"black"}
      >
        My Chats


          <GroupChatModal>
          <Button 
       display="flex"
       fontSize={{base:"17px",md:"10px",lg:"17px"}}
       
       >
        
        New Group Chat
        <CiCirclePlus />
        </Button> 
          </GroupChatModal>
      </Box>
      <Box
      display={"flex"}
      flexDirection={"column"}
      p={3}
      bg="#F8F8F8"
      w="100%"
      h="100%"
      borderRadius={"lg"}
      overflow={"hidden"}
      >
        {
          chats?(
            <Stack overflowY={"scroll"}>
              {chats.map((chat)=>(
                <Box
                onClick={()=> setSelectedChat(chat)}
                cursor={"pointer"}
                bg={selectedChat===chat?"#38B2AC":"#E8E8E8"}
                color={selectedChat===chat?"white":"black"}
                px={3}
                py={2}
                borderRadius={"lg"}
                key={chat._id}
                >
                  <Text>
                    {!chat.isGroupChat?getSender(loggedUser,chat.users):chat.chatName}
                  </Text>

                </Box>
              ))}

            </Stack>
          ):(
            <ChatLoading/>
          )
        }

      </Box>
      </Box>
  )
}

export default MyChats
