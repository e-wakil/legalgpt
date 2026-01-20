import { useEffect } from 'react'
import {  GoogleOAuthProvider } from '@react-oauth/google'
import Router from './Routes/Router'

//zustand
import useUserStore from './store/userStore';
import axiosInstance from './api/axiosInstance';

function App() {
  const addUser = useUserStore(state => state.addUser)
  const user = useUserStore(state=> state.user)
  useEffect(()=>{
    const checkUser = async () => {
      try {
        const response = await axiosInstance.get('/users/me');
        // console.log(response)
        const user = response.data;
        addUser({ id: user.id, name: user.full_name, profile: user.picture_url, email: user.email })
      }catch(err){
        console.log('error')
      }
    }
    checkUser();
  },[])
  // console.log(user)

  return (
        <div>
          {/* <Router /> */}
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <Router />
          </GoogleOAuthProvider>

        </div>
      )
    }

export default App
