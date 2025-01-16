import { Button } from "@chakra-ui/react"
import Home from "./pages/Home"
import { Route } from "react-router-dom/cjs/react-router-dom.min"
import Chat from "./pages/Chat"
import './App.css';
function App() {

  return (
    <div className="App">
    <Route path="/" component={Home} exact/>
    <Route path="/chats" component={Chat}/>
    </div>
  )
}

export default App
