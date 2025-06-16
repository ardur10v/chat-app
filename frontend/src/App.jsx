import {Routes,Route, Navigate} from "react-router-dom"
import HomePage from "./pages/HomePage"
import SignupPage from "./pages/SignupPage"
import Profile from "./pages/Profile"
import Settings from "./pages/Settings";
import LoginPage from "./pages/LoginPage";
import {useAuthStore} from "../src/store/useAuthStore"
import { useEffect } from "react";
import {Loader} from "lucide-react";
import {Toaster} from "react-hot-toast"
import Navbar from "./components/Navbar"


const App = () => {
  const {authUser,checkAuth,isCheckingAuth,onlineUsers} =useAuthStore();
  console.log({onlineUsers})
  useEffect(()=>{
    useAuthStore.getState().checkAuth();
  },[checkAuth]);

  console.log({authUser});

  if(isCheckingAuth && !authUser) return(
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin"/>
    </div>
  )

  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/signup" element={<SignupPage/>}/>
        <Route path="/login" element={!authUser ? <LoginPage/> : <Navigate to="/"/>}/>
        <Route path="/settings" element={<Settings/>}/>
        <Route path="/profile" element={<Profile/>}/>
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App