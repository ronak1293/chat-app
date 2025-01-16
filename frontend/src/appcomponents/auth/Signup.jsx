import React, { useState } from 'react'
"use client"
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import axios from 'axios'
import { Button } from "@chakra-ui/react"
import { Toaster, toaster } from "@/components/ui/toaster"
function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pic, setPic] = useState('');
  const [loading,setLoading]=useState(false)
  const history=useHistory();
const submitHandler=async ()=>{
  setLoading(true)
   if(!name||!email||!password){
    toaster.create({
      title: `please fill all the fields`,
      type:"error",
    })
    setLoading(false);
    return;
   }
   try {
    const config={
      headers:{
        "Content-type":"application/json"
      },
    }
    const {data}=await axios.post('/api/user',{name,email,password,pic},config);
    toaster.create({
      title: `registration successful`,
      type:"success",
    })
    localStorage.setItem('userInfo',JSON.stringify(data))
    setLoading(false)
    history.push('/chats')
   } catch (error) {
    toaster.create({
      title: `error occured`,
      type:"error",
    })
    setLoading(false);
   }

}
const postDetails=(pics)=>{
setLoading(true);
if(pics==undefined){
  
      
         toaster.create({
      title: `please select an image`,
      type:"warning",
    })
  
    return;
}
if(pics.type==='image/jpeg'||pics.type=='image/png'){
  const data=new FormData;
  data.append('file',pics);
  data.append('upload_preset','chat-app');
  data.append('cloud_name','djymzjci3');
  fetch("https://api.cloudinary.com/v1_1/djymzjci3/image/upload",{
    method:'post',
    body:data,
  }).then((res)=> res.json())
  .then((data)=>{
    setPic(data.url.toString());
    console.log(data.url.toString())
    setLoading(false)
  }).catch((err)=>{
    console.log(err);
    setLoading(false);
  })
}
else{
  
    toaster.create({
      title: `please select an image`,
      type:"warning",
    })
    setLoading(false);
    return;
  
}
}
  return (
    <>
      <form>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }}>

          {/* Name */}
          <label htmlFor="name" style={{ fontWeight: 'bold', color: 'black' }}>Name</label>
          <input 
            type="text" 
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name" 
            required 
            style={{ borderRadius: '7px', padding: '10px', width: '100%', color: 'white' }} 
          />

          {/* Email */}
          <label htmlFor="email" style={{ fontWeight: 'bold', color: 'black' }}>Email</label>
          <input 
            type="email" 
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email" 
            required 
            style={{ borderRadius: '7px', padding: '10px', width: '100%', color: 'white' }} 
          />

          {/* Password */}
          <label htmlFor="password" style={{ fontWeight: 'bold', color: 'black' }}>Password</label>
          <input 
            type="password" 
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password" 
            required 
            style={{ borderRadius: '7px', padding: '10px', width: '100%', color: 'white' }} 
          />

          {/* Profile Picture */}
          <label htmlFor="pic" style={{ fontWeight: 'bold', color: 'black' }}>Profile Picture</label>
          <input 
            type="file" 
            accept='image/*'
            id="pic"
            
            onChange={(e) => postDetails(e.target.files[0])}
            style={{ borderRadius: '7px', padding: '10px', width: '100%' ,background:'black'}} 
          />

          {/* Submit Button */}
          <button 
            type="submit" 
            style={{ background: 'blue', color: 'white', padding: '10px', borderRadius: '7px', width: '100%',cursor:'pointer' }}
            onClick={submitHandler}
            disabled={loading}
          >
           {loading ? "Loading..." : "Sign up"}
          </button>
          
        </div>
      </form>
    </>
  )
}

export default Signup;
