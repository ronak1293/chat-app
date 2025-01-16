import { Box } from '@chakra-ui/react';
import React, { useState } from 'react'
import { Tooltip } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Text } from "@chakra-ui/react"
import {
  MenuContent,
  MenuItem,
  MenuItemCommand,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu"
import { FaBell } from "react-icons/fa";

import { Avatar } from '@/components/ui/avatar';
import { ChatState } from '@/Context/ChatProvider';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import {
  DrawerActionTrigger,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@chakra-ui/react"
import ChatLoading from '../ChatLoading';
//console.log(Box)
import axios from 'axios';
import UserListItem from '../userAvatar/UserListItem';
import { Spinner } from "@chakra-ui/react"
import { getSender } from '@/config/ChatLogics';

function SideDrawer() {
  
  const [search,setSearch]=useState("")
  const [searchResult,setSearchResult]=useState([])
  const [loading,setLoading]=useState(false);
  const [loadingChat,setLoadingChat]=useState();
const history=useHistory()
console.log(history)
  const {user,setSelectedChat,chats,setChats,notification,setNotification}=ChatState();

  const logoutHandler=()=>{
    localStorage.removeItem('userInfo')
    history.push('/');
  }

  const handleSearch=async ()=>{
   if(!search){
    alert('please enter something in toast')
    return;
   }
    try {
      setLoading(true);
      const config={
        headers:{
          Authorization:`Bearer ${user.token}`
        }
      }
      const {data}=await axios.get(`/api/user?search=${search}`,config);
      //console.log(data);
      
      
      setSearchResult(data);
      setLoading(false)
    } catch (error) {
      alert('failed to load the search results')
    }
   
  }

  const accessChat=async (userId)=>{
    try {
      setLoadingChat(true);

      const config={
        headers:{
          "Content-type":"application/json",
          Authorization:`Bearer ${user.token}`,
        }
      }
      const {data}=await axios.post('/api/chat',{userId},config);
      if(!chats.find((c)=> c._id===data._id)) setChats([data,...chats]);
      setSelectedChat(data)
      setLoadingChat(false)
    } catch (error) {
      alert("error fetching chat")
    }
  }
  return (
    <>
    <Box
  display="flex"
  justifyContent="space-between"
  alignItems="center"
  bg="white"
  w="100%"
  p="5px 10px"
  color="black"
>

  <Tooltip label="Search users to chat" hasArrow placement="bottom-end">
  <DrawerRoot key={"start"} placement={"start"}>
            <DrawerBackdrop />
            <DrawerTrigger asChild>
            <Button variant="subtle">
      <i className="fas fa-search"></i> {/* Changed `class` to `className` */}
      <Text display={{ base: "none", md: "flex" }} px="4">
        Search User
      </Text>
    </Button>
            </DrawerTrigger>
            <DrawerContent
              roundedTop={"start" === "bottom" ? "l3" : undefined}
              roundedBottom={"start" === "top" ? "l3" : undefined}
            >
              <DrawerHeader>
                <DrawerTitle>Serach users</DrawerTitle>
              </DrawerHeader>
              <DrawerBody>
                <Box display={"flex"} pb={2}>
                  <Input placeholder='search by name or email' mr={2} value={search} onChange={(e)=> setSearch(e.target.value)}>
                  </Input>
                  <Button onClick={handleSearch}>Go</Button>
                </Box>
                {loading?(
                  <ChatLoading/>
                ):(
                  searchResult?.map(user=>{
                    return (
                    <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={()=>accessChat(user._id)}
                    />)
                  })

                )}
                {loadingChat&&<Spinner ml="auto" display="flex"/>}

              </DrawerBody>
             
              <DrawerCloseTrigger />
            </DrawerContent>
          </DrawerRoot>

    
  </Tooltip>

  <Text fontSize={"2xl"} fontFamily={"Work sans"}>
    Chat App
  </Text>

  <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "100px", // Correctly adds space between children
  }}
>
  <MenuRoot>
    <MenuTrigger asChild>
    <FaBell style={{cursor:'pointer'}} />
    </MenuTrigger>
    <MenuContent placement="bottom-end">
      {/* Ensures menu opens below */}
      {!notification.length&&"no new messages"}
      {notification&&notification.map((notif)=>(
        <MenuItem key={notif._id} onClick={()=>{
          setSelectedChat(notif.chat);
          setNotification(notification.filter((n)=>n!==notif))

        }}>
          {notif.chat.isGroupChat?`new message in ${notif.chat.chatName}`:`new message from ${getSender(user,notif.chat.users)}`}
        </MenuItem>
      ))}
    </MenuContent>
  </MenuRoot>

  <MenuRoot>
      <MenuTrigger asChild>
        <Button variant="outline" size="bg">
          <Avatar cursor="pointer" name={user.name} src={user.pic}></Avatar>
        </Button>
      </MenuTrigger>
      <MenuContent>
        <MenuItem value="new-txt">{user.email}</MenuItem>
        <MenuItem value="new-txt-a" cursor={"pointer"} onClick={
          logoutHandler
        }> log out</MenuItem>
        
      </MenuContent>
    </MenuRoot>
    
</div>

</Box>



    </>
   
  )
}

export default SideDrawer
