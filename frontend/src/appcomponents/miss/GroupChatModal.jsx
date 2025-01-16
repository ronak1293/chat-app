import React, { useState ,useRef} from 'react'
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
import { Box, Button } from '@chakra-ui/react'
import axios from 'axios'
import {  Fieldset, Input, Stack } from "@chakra-ui/react"
import { Field } from "@/components/ui/field"
import { ChatState } from '@/Context/ChatProvider'
import UserListItem from '../userAvatar/UserListItem'
import UserBadgeItem from '../userAvatar/UserBadgeItem'

function GroupChatModal({children}) {
  const [groupChatName,setGroupChatName]=useState("");
  const [selectedUsers,setSelectedUsers]=useState([]);
  const [search,setSearch]=useState("");
  const [searchResult,setSearchResult]=useState([]);
  const [loading,setLoading]=useState(false);
const {user,chats,setChats}=ChatState();
const dialogCloseRef=useRef();


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

const handleSubmit=async ()=>{
  if(!groupChatName||!selectedUsers){
    alert('fill all the fields');
    return;
  }

  try {
    const config={
      headers:{
        Authorization:`Bearer ${user.token}`
      }
    }
  
    const {data}=await axios.post(`/api/chat/group`,{
      name:groupChatName,
      users:JSON.stringify(selectedUsers.map((u)=>(u._id)))
    },config)
    setChats([data,...chats])
    dialogCloseRef.current?.click();
    alert("successfully created group")
  } catch (error) {
    alert('error')
  }

}
const handleGroup=(userToAdd)=>{
if(selectedUsers.includes(userToAdd)){
  alert('user already added to group')
  return;
}
setSelectedUsers([...selectedUsers,userToAdd])
}
const handleDelete=(delUser)=>{
  setSelectedUsers(selectedUsers.filter((sel) => sel._id!==delUser._id))
}
  return (
    <DialogRoot>
    <DialogTrigger asChild>
      {children}
    </DialogTrigger>
    <DialogContent>
      <DialogHeader
      fontSize={"35px"}
      fontFamily={"Work sans"}
      display={"flex"}
      justifyContent={"center"} 
      >
        <DialogTitle>Create Group Chat</DialogTitle>
      </DialogHeader>
      <DialogBody display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      >
           <Fieldset.Root size="lg" maxW="md">

      <Fieldset.Content>
        <Field label="Chat Name">
          <Input  placeholder='chat name' mb={3} value={groupChatName}
          onChange={(e)=> setGroupChatName(e.target.value)}
          />
        </Field>

        <Field label="Search Users">
          <Input placeholder='e.g john doe,jan doe'
          value={search}
          mb={1}
          onChange={(e)=> handleSearch(e.target.value)}
          />
        </Field>

  <Box width={"100%"} display={"flex"} flexWrap={"wrap"}>
    {selectedUsers.map((u)=>(
    <UserBadgeItem key={user._id} user={u} handleFunction={()=> handleDelete(u)}/>
  ))}
  </Box>

{
  loading?(<div>loading</div>):(
    searchResult?.slice(0,4).map((user)=>(<UserListItem key={user._id} user={user} handleFunction={()=> handleGroup(user)}/>))
  )
}
        
      </Fieldset.Content>
    </Fieldset.Root>
      </DialogBody>
      <DialogFooter>
        <DialogActionTrigger asChild>
          <Button variant="outline" ref={dialogCloseRef}>Cancel</Button>
        </DialogActionTrigger>
        <Button colorScheme={"blue"} onClick={handleSubmit}>Create group chat</Button>
      </DialogFooter>
      <DialogCloseTrigger />
    </DialogContent>
  </DialogRoot>
  )
}

export default GroupChatModal
