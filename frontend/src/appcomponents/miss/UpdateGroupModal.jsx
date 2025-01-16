import React, { useState } from 'react'
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
import { Box, Spinner } from '@chakra-ui/react'
import { FaEye } from "react-icons/fa";
import { Image } from '@chakra-ui/react';
import { Text } from '@chakra-ui/react';
import { ChatState } from '@/Context/ChatProvider';
import UserBadgeItem from '../userAvatar/UserBadgeItem';
import {  Fieldset, Input, Stack } from "@chakra-ui/react"
import { Field } from "@/components/ui/field"
import axios from 'axios';
import UserListItem from '../userAvatar/UserListItem';

function UpdateGroupModal({fetchAgain,setFetchAgain, fetchMessages}) {
  const [groupChatName,setGroupChatName]=useState("");
  const [search,setSearch]=useState("");
  const [searchResult,setSearchResult]=useState([]);
  const [loading,setLoading]=useState(false);
  const [renameLoading,setRenameLoading]=useState(false);

  const {selectedChat,setSelectedChat,user}=ChatState();

  const handleRemove=async (user1)=>{
    if(selectedChat.groupAdmin._id!==user._id&&user1._id!==user._id){
      alert('only admins can remove someone');
      return;
    }

    try {
      setLoading(true);
      const config={
        headers:{
          Authorization:`Bearer ${user.token}`
        }
      }
      const {data}=await axios.put(`/api/chat/groupremove`,{
        chatId:selectedChat._id,
        userId:user1._id,
      },config);

      user1._id===user._id?setSelectedChat():setSelectedChat(data);
      setFetchAgain(!fetchAgain)
      fetchMessages();
      setLoading(false);
    } catch (error) {
      alert(error.response.data.message)
      
    }
  }

  const handleRename=async ()=>{
    if(!groupChatName) return;
    try {
      setRenameLoading(true);
      const config={
        headers:{
          Authorization:`Bearer ${user.token}`,
        }
      }

      const {data}=await axios.put(`/api/chat/rename`,{
        chatId:selectedChat._id,
        chatName:groupChatName,
      },config)

      setSelectedChat(data);
      setFetchAgain(!fetchAgain)
      setRenameLoading(false);
    } catch (error) {
      alert(error.response.data.message);
      setRenameLoading(false);
    }
    
    setGroupChatName('');
  }
  const handleSearch=async (query)=>{
    setSearch(query);
    if(!query){
      return;
    }
    
    try {
      const config={
        headers:{
          Authorization:`Bearer ${user.token}`
        }
      }
    
      const {data}=await axios.get(`/api/user?search=${search}`,config);
    
      console.log(data);
      setLoading(false);
      setSearchResult(data);
      
    } catch (error) {
      alert('failed to search results')
    }
    }

    const handleAddUser=async (user1)=>{
      if(selectedChat.users.find((u)=>u._id===user1._id)){
        alert("user already in group");
        return;
      }

      if(selectedChat.groupAdmin._id!==user._id){
        alert('only admin can add someone');
        return;
      }
      try {
        setLoading(true);
        const config={
          headers:{
            Authorization:`Bearer ${user.token}`,
          }
        }
        const {data}=await axios.put('/api/chat/groupadd',{
          chatId:selectedChat._id,
          userId:user1._id,
        },config)
        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setLoading(false);
      } catch (error) {
        alert('error')
        setLoading(false);
      }


    }
  return (
     <Box>
           <DialogRoot  key={"center"}
            placement={"center"}>
          <DialogTrigger asChild>
          <FaEye style={{cursor:"pointer"}} />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle
              fontSize={"35px"}
              fontFamily={"Work sans"}
              display={"flex"}
              justifyContent={"center"}
              >{selectedChat.chatName}</DialogTitle>
            </DialogHeader>
    
    <DialogBody>
    <Box width={"100%"} display={"flex"} flexWrap={"wrap"} pb={3}>
    {selectedChat.users.map((u)=>(
    <UserBadgeItem key={u._id} user={u} handleFunction={()=> handleRemove(u)}/>
  ))}
    </Box>
     <Fieldset.Root size="lg" maxW="md">
    
          <Fieldset.Content>
            <Field label="Chat Name"
            >
              <Box display={"flex"} gap={"6px"}>
              <Input  placeholder='chat name' mb={3} value={groupChatName}
              onChange={(e)=> setGroupChatName(e.target.value)}
              />
              <Button
              variant="solid"
              colorScheme="teal"
              ml={1}
              isLoading={renameLoading}
              onClick={handleRename}>update</Button>
              </Box>
             
            </Field>
    
            <Field label="Search Users">
              <Input placeholder='add user to group'
              value={search}
              mb={1}
              onChange={(e)=> handleSearch(e.target.value)}
              />
            </Field>
            </Fieldset.Content>
                </Fieldset.Root>
                {loading?(
                  <Spinner size="lg"/>
                ):(
                  searchResult?.map((user)=>(
                    <UserListItem key={user._id}
                    user={user}
                    handleFunction={()=>handleAddUser(user)}/>
                  ))
                )}
    </DialogBody>
    

            
            <DialogFooter>
              <DialogActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </DialogActionTrigger>
              <Button style={{background:"red",color:"white"}}onClick={()=>handleRemove(user)} >leave group</Button>
            </DialogFooter>
            <DialogCloseTrigger />
          </DialogContent>
        </DialogRoot>
        </Box>
  )
}

export default UpdateGroupModal
