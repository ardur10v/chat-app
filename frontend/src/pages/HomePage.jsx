import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/NoChatSelected";
import { useChatStore } from "../store/useChatStore";
import {useAuthStore} from "../store/useAuthStore";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const HomePage = () => {
  const {selectedUser} =useChatStore();
  const navigate=useNavigate();
  const {authUser,isCheckingAuth} =useAuthStore();
  useEffect(()=>{
    if(!isCheckingAuth && !authUser){
      navigate("/signup");
    }
  })
  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar/>
            {!selectedUser?<NoChatSelected/>:<ChatContainer></ChatContainer>}
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage