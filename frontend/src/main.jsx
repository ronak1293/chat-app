import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from "@/components/ui/provider"
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min'
import ChatProvider from './Context/ChatProvider'

createRoot(document.getElementById('root')).render(

  
<BrowserRouter>
<ChatProvider>
<Provider>
      <App />
      </Provider>
</ChatProvider>
      
    </BrowserRouter>
    
    
    
  
)
