import { useEffect, useState } from 'react';
import './App.css';
import { logOutUser, refreshUser } from "./redux/userReducer"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Hero from './components/Hero/Hero';
import Navbar from './components/Navbar/Navbar';
import Shop from './pages/Shop/Shop';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Accounts from './pages/Accounts/Accounts';
import { useSelector, useDispatch } from 'react-redux';
import Cart from './pages/Cart/Cart';
import Wishlist from './pages/Wishlist/Wishlist';
import ManageProducts from './pages/ManageProducts/ManageProducts';
import axios from 'axios';
import loadingAnimation from "./img/loading.gif"

function App() {
  const dispatch = useDispatch()
  const userLoginState = useSelector((state) => state.userReducer.isLoggedIn)

  const [loadingVal, setLoadingVal] = useState(false);

  // code to make a call to the backend to get new access token
  useEffect(() => {
    setLoadingVal(true);
    if(!userLoginState) {
      // /refresh/user
      axios.get("/api/auth/refresh/user", {
        withCredentials: true
      }).then(res => {
        if(res.data.error) {
          // clear the data and logout the user
          dispatch(logOutUser());
          setLoadingVal(false);
          return;
        } else {
          // update the user data with new access token
          dispatch(refreshUser(res.data.user));
          setLoadingVal(false);
          return;
        }
      })
    }
  }, []);
  
  const renderLoading = () => {
    return (
      <div className='mainapp_loading'>
        <img src={loadingAnimation} className="mainapp_loading_img" />
      </div>
    )
  }


  return (
    <Router>
      {loadingVal ? 
        renderLoading():
        <div className="App">
          <Navbar />
          <Routes>
            <Route exact path='/' element={<Hero />} />          
            <Route exact path='/shop' element={<Shop />} />      
            {!userLoginState? <Route exact path='/login' element={<Login />} /> : null}      
            <Route exact path='/signup' element={<Signup />} />
            {userLoginState ? <Route exact path='/account' element={<Accounts />} /> : null}
            {userLoginState ? <Route exact path='/cart' element={<Cart />} /> : null}
            {userLoginState ? <Route exact path='/wishlist' element={<Wishlist />} /> : null}
            {userLoginState ? <Route exact path='/products/manage' element={<ManageProducts />} /> : null}
            <Route exact path='*' element={<Hero />} />      
          </Routes>
        </div>
      }
    </Router>
  );
}

export default App;
