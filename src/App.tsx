import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Router from './routes';
import { useEffect } from 'react';
import LocalService from './services/local_service';
import { useAuthStore } from './stores/AuthStore';
import {  USER_FROM_LOCAL_STORAGE } from './constants';


const localService = new LocalService();
function App() {
  const setUserData = useAuthStore((state) => state.setUserData);
  const setFetching = useAuthStore((state) => state.setFetching);
  
  useEffect(() => {
    async function checkIfAlreadyAuthenticated() {
      setFetching(true);
      const accessToken = await localService.getAccessToken();
     
      const userFromLocalStorage = localService.getItem(USER_FROM_LOCAL_STORAGE);
      if (accessToken && userFromLocalStorage && userFromLocalStorage !== "undefined") {
        const user = JSON.parse(userFromLocalStorage);
        setUserData({ token: accessToken, user: user });
      }
      setFetching(false);
    }
    checkIfAlreadyAuthenticated();
  }, []);

  return (
    <div className="min-h-screen  ">
      <Toaster />
      <Navbar />
      <Router />
    </div>
  )
}

export default App
