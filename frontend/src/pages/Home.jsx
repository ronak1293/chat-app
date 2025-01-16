import React, { useEffect } from 'react';
import { Container, Box, Text } from '@chakra-ui/react';
import { Tabs } from "@chakra-ui/react"
import { LuFolder, LuSquareCheck, LuUser } from "react-icons/lu"
import Login from '@/appcomponents/auth/Login';
import Signup from '@/appcomponents/auth/Signup';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
function Home() {
  const history=useHistory();
  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem('userInfo'));
    if(user) history.push('/chats')
  },[history])
  return (
    <Container maxW='xl' centerContent>
      <Box
        d='flex'
        justifyContent='center'
        alignItems='center'  
        p={3}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius={"lg"}
        borderWidth={"1px"}
        textAlign="center" 
        background="rgba(255, 255, 255, 0.8)"
      >
        <Text fontFamily={"Work sans"} fontSize={"4xl"} color={"black"}>
          Chats
        </Text>
      </Box>
      <Box background="rgba(255, 255, 255, 0.8)"   w="100%" p={4} borderRadius={"lg"} borderWidth={"1px"} justifyItems={'center'}>
        
      <Tabs.Root defaultValue="members" variant="plain">
      <Tabs.List bg="bg.muted" rounded="l3" p="1">
        <Tabs.Trigger value="members">
          <LuUser />
          Login
        </Tabs.Trigger>
        <Tabs.Trigger value="projects">
          <LuFolder />
          sign up
        </Tabs.Trigger>
        <Tabs.Indicator rounded="l2" />
      </Tabs.List>
      <Tabs.Content value="members"><Login/></Tabs.Content>
      <Tabs.Content value="projects"><Signup/></Tabs.Content>

    </Tabs.Root>
      </Box>
    </Container>
  );
}

export default Home;
