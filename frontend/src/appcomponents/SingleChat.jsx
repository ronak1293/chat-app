import { ChatState } from '@/Context/ChatProvider'
import React, { useEffect, useState } from 'react'
import { Box, Spinner } from '@chakra-ui/react';
import { Text } from '@chakra-ui/react';
import { IoMdArrowBack } from "react-icons/io";
import { getSender,getSenderFull } from '@/config/ChatLogics';
import ProfileModal from './miss/ProfileModal';
import UpdateGroupModal from './miss/UpdateGroupModal';
import { Field } from "@/components/ui/field"
import { Input } from '@chakra-ui/react';
import axios from 'axios';
import './style.css'
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client'
import Lottie from 'react-lottie';
import animationData from "../animations/typing.json"

const ENDPOINT="http://localhost:5000"
var socket,selectedChatCompare;

const defaultoptions={
  loop:true,
  autoplay:true,
  animationData:animationData,
  rendererSettings:{
    preserveAspectRatio:"xMidYMid slice"
  }
}

function SingleChat({fetchAgain,setFetchAgain}) {
  const [messages,setMessages]=useState([]);
  const [loading,setLoading]=useState(false);
  const [newMessage,setNewMessage]=useState("");
  const {user,selectedChat,setSelectedChat,notification,setNotification}=ChatState();
  const [socketConnected,setSocketConnected]=useState();
  const [typing,setTyping]=useState(false);
  const [isTyping,setIsTyping]=useState(false);

  const fetchMessages=async ()=>{
    if(!selectedChat) return;
    try {
      const config={
        headers:{
          Authorization:`Bearer ${user.token}`
        }
      }

      setLoading(true);
      const {data}=await axios.get(`api/message/${selectedChat._id}`,config);
      

      setMessages(data);
      setLoading(false);

      socket.emit("join chat",selectedChat._id);
    } catch (error) {
      alert('failed to load the messages');
    }
  }

  useEffect(()=>{
    fetchMessages();
    selectedChatCompare=selectedChat;
  },[selectedChat])

  useEffect(()=>{
    socket=io(ENDPOINT);
    socket.emit("setup",user)
    socket.on('connected',()=> setSocketConnected(true))
    socket.on('typing',()=>setIsTyping(true));
    socket.on('stop typing',()=> setIsTyping(false));
    
  },[]);
  useEffect(()=>{
    socket.on("message recieved",(newMessageRec)=>{
      if(!selectedChatCompare||selectedChatCompare._id!==newMessageRec.chat._id){
        //notification
        if(!notification.includes(newMessageRec)){
          setNotification([newMessageRec,...notification])
          setFetchAgain(!fetchAgain);
        }

      }
      else{
        setMessages([...messages,newMessageRec])
      }
    })
  })

  const sendMessage=async (e)=>{
    if(e.key==="Enter"&&newMessage){
      socket.emit("stop typing",selectedChat._id)
      try {
        const config={
          headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${user.token}`,
          }
        }
        
        setNewMessage("");
        const {data}=await axios.post('/api/message',{
          content:newMessage,
          chatId:selectedChat._id,
        },config);

        console.log(data);
        
        //setNewMessage("");
        setMessages([...messages,data]);
        socket.emit('new message',data);
      } catch (error) {
        alert('failed to send the message')
      }
    }
  }
  const typingHandler=(e)=>{
    setNewMessage(e.target.value);
    if(!socketConnected) return;
    if(!typing){
      setTyping(true);
      socket.emit("typing",selectedChat._id);
    }
    let lastTypingTime=new Date().getTime();
    var timerLength=3000;
    setTimeout(()=>{
      var timeNow=new Date().getTime();
      var timeDiff=timeNow-lastTypingTime;
      if(timeDiff>=timerLength&&typing){
        socket.emit("stop typing",selectedChat._id);
        setTyping(false);
      }
    },timerLength)
  }
  
  return (
    <>
    {selectedChat?(
      <>
      <Text
      fontSize={{base:"28px",md:'30px'}}
      pb={3}
      px={2}
      w="100%"
      fontFamily={"Work sans"}
      display={"flex"}
      justifyContent={{base:"space-between"}}
      alignItems={"center"}
      color={"black"}
      >
        <Box display={{base:"flex",md:"none"}} color={"black"} onClick={()=> setSelectedChat("")}
          cursor={"pointer"}>
        <IoMdArrowBack />
        </Box>
        {
          !selectedChat.isGroupChat?(
<>{getSender(user,selectedChat.users)}
<ProfileModal user={getSenderFull(user,selectedChat.users)}/></>
          ):(
            <>
            {selectedChat.chatName.toUpperCase()}
            <UpdateGroupModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}
             fetchMessages={ fetchMessages}
            />
            </>
          )
        }
      </Text>
      <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"flex-end"}
      p={3}
      background={"#E8E8E8"}
      width={"100%"}
      height={"100%"}
      borderRadius={"lg"}
      overflowY={"hidden"}
      >
        {loading?(<Spinner
        size={"xl"}
        width={20}
        height={20}
        alignSelf={"center"}
        margin={"auto"}
        />):(
          <div className='messages'>
{console.log(messages)
}
            <ScrollableChat messages={messages}/>
          </div>
        )}
        <Field onKeyDown={sendMessage}  mt={3} >
          {isTyping?<div color='black'>

            <Lottie
            options={defaultoptions}
            width={70}
            style={{marginBottom:15,marginLeft:0}}/>
          </div>:<></>}
          <Input
          variant="filled"
          background="#E0E0E0"
          placeholder="Enter a message ..."
          onChange={typingHandler}
          value={newMessage}
          color={"black"}
           />
        </Field>
      </Box>
      </>
    ):(
      <Box
      display="flex"
      alignItems="center"
      justifyContent={"center"}
      height={"100%"}
      >
        <Text fontSize={"3xl"} pb={3} fontFamily={"Work sans"} color={"black"}>
          click on a user to start chatting
        </Text>

      </Box>
    )}
    </>
  )
}

export default SingleChat
