import React, { useState } from 'react';
import { Toaster, toaster } from "@/components/ui/toaster"
import axios from 'axios';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading,setLoading]=useState(false);
  const history=useHistory();
  const submitHandler=async ()=>{
    setLoading(true)
    if(!email||!password){
      <Toaster />
      toaster.create({
            title: `please fill all the fields`,
            type:"warning",
          })
          setLoading(false)
          return;
    }
    try {
      const config={
        headers:{
          "content-type":'application/json',
        }
      }
      const {data}=await axios.post("/api/user/login",{email,password},config);

      toaster.create({
        title: `login successful`,
        type:"success",
      })

      localStorage.setItem('userInfo',JSON.stringify(data));
      setLoading(false)
      history.push('/chats')
      
      
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        // Use the error message from the backend
        alert(err.response.data.message);
      } 
      toaster.create({
        title: `error occured`,
        type:"error",
      })
      setLoading(false)
    }
    
  }
  return (
    <>
      <form>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }}>

          {/* Email */}
          <label htmlFor="lemail" style={{ fontWeight: 'bold', color: 'black' }}>Email</label>
          <input 
            type="email" 
            id="lemail"
            
            placeholder="Enter your email" 
            required 
            value={email}
            style={{ borderRadius: '7px', padding: '10px', width: '100%', color: 'white' }} 
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password */}
          <label htmlFor="lpassword" style={{ fontWeight: 'bold', color: 'black' }}>Password</label>
          <input 
            type="password" 
            id="lpassword"
            value={password}
            placeholder="Enter your password" 
            required 
            style={{ borderRadius: '7px', padding: '10px', width: '100%', color: 'white' }} 
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Submit Button */}
          <button 
            type="submit" 
            style={{ background: 'blue', color: 'white', padding: '10px', borderRadius: '7px', width: '100%' ,cursor:'pointer'}}
            onClick={submitHandler}
            disabled={loading}
          >
             {loading ? "Loading..." : "Log In"}
          </button>

          {/* Get Guest User Credentials Button */}
          <button 
            type="button" 
            style={{ background: 'red', color: 'white', padding: '10px', borderRadius: '7px', width: '100%',cursor:'pointer' }}
            onClick={()=>{
              setEmail("guest@exapmle.com");
              setPassword("123456")
            }}
            
          >
            Get Guest User Credentials
          </button>

        </div>
      </form>
    </>
  );
}

export default Login;
