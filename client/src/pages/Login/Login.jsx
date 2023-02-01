import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import img from "../../img/camping.gif";
import axios from "axios";
import { useDispatch } from 'react-redux'
import { loginUser } from '../../redux/userReducer';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

function Login() {
  const dispatch = useDispatch()
  let navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  const [loginDataError, setLoginDataError] = useState({
    email: {
      error: false,
      message: "",
    },
    password: {
      error: false,
      message: "",
    },
  });
  const [loginError, setLoginError] = useState({
    status: false,
    message: "",
  });
  const [loginSuccess, setLoginSuccess] = useState(false); 
  const [loading, setLoading] = useState(false);

  // functions to validate the inputs
  const validateEmail = (email) => {
    if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      const updatVal = {
                    ...loginDataError,
                    email: {
                      ...loginDataError.email,
                      error: false,
                      message: ""
                    }
                  }
      setLoginDataError(updatVal)
      return true;
    } else {
      const updateVal = {
        ...loginDataError,
        email: {
          ...loginDataError.email,
          error: true,
          message: "Please enter a valid email!"
        }
      }
      setLoginDataError(updateVal)
      return false
    }
  };

  // function to handle change in the input
  const handleChange = (e) => {
    e.preventDefault();

    // removing the errors
    if(e.target.name === "email") {
      setLoginDataError({
        ...loginDataError,
        email: {
          ...loginDataError.email,
          error: false,
          message: "",
        }
      })
    } else if(e.target.name === "password") {
      setLoginDataError({
        ...loginDataError,
        password: {
          ...loginDataError.password,
          error: false,
          message: "",
        }
      })
    }
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    })
  };

  const checkForWishlistData = async (wishlistArrArg) => {
    // await axios.get("/api/product/get/all").then(res => {
    //   if (res.data.error) {
    //     return setFetchError(true);
    //   }
    //   console.log(res.data.products)
    //   const tempArray = [...res.data.products]
    //   setProducts(res.data.products);
    //   return setLoading(false);
    // })
  }

  // function to handle form submit
  const formSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); //setting the loading valirable to true
    // check if the inputs are empty
    if(loginData.email === "" || loginData.password === "") {
      // check for both
      if(loginData.email === "" && loginData.password === "") {
        setLoginDataError({
          ...loginDataError,
          email: {
            ...loginDataError.email,
            error: true,
            message: "Please enter your email"
          },
          password: {
            ...loginDataError.password,
            error: true,
            message: "Please enter your password"
          }
        })
      } else {

        // check for email
        if(loginData.email === "") {
          console.log('reached here')
          setLoginDataError({
            ...loginDataError,
            email: {
              ...loginDataError.email,
              error: true,
              message: "Please enter your email"
            }
          })
        }
        // check for password 
        if(loginData.password === "") {
          setLoginDataError({
            ...loginDataError,
            password: {
              ...loginDataError.password,
              error: true,
              message: "Please enter your password!"
            }
          })
        }
      }
      setLoading(false)
      return;
    }

    // validate the inputs
    // validate email
    const emailFlagIs = await validateEmail(loginData.email);

    if(emailFlagIs) {
      console.log(!loginDataError.email.error, !loginData.password.error)
      if(!loginDataError.email.error && !loginData.password.error) {
        
        // login the user
        const userPayload = {
          email: loginData.email,
          password: loginData.password
        }
        
        await axios.post("/api/user/login", userPayload, {withCredentials: true}).then(user => {
          console.log(user.data.error);
          
          if(user.data.error) {
            setLoginError({
              status: true,
              message: user.data.message
            });
            setTimeout(() => {
              setLoginError({
                status: false,
                message: ""
              });
            }, 5000);
            // set the error message state to true

            return
          }
            // setting all the errors to false
            setLoginError({
              status: false,
              message: ""
            });

            // check if all the wishlist are present in database
            console.log(user.data.wishlist);

            // storing the user in redux
            dispatch(loginUser(user.data.user));

            // set loading to false
            setLoading(false)

            // open dialouge to show successful login
            setLoginSuccess(true)
          
        }).catch(err => {
          setLoginError({
            status: true,
            message: "Some error occured, please try again with new credentials!"
          });
          setTimeout(() => {
            setLoginError({
              status: false,
              message: ""
            });
          }, 5000);
          setLoading(false);
        })
      }
    } else {
      setLoading(false);
    }
  };

  const handleDialougClose = (e) => {
    e.preventDefault();
    navigate("/");
  }

  const displayError = () => {
    return (
      <div className="login_error_bar">
        <p className="login_error_bar_text">{loginError.message}</p>
      </div>
    )
  }

  return (
    <div className='login'>
      {/* displaying the error if any */}
      {loginError.status ? displayError() : null}
      <div className="login__box">
        <div className="login__box--left">
          <img src={img} alt="" className='login__box--img'/>
        </div>
        <div className="login__box--right">
          <div className="form__div">
            <div className="form__div--heading">
              <p className="form__div--heading--text">Login</p>
            </div>
            <div className="form__div--row">
              <p className="form__div--lable">Email</p>
              <input
                type="text"
                name="email"
                id={loginDataError.email.error ? "error": ""}
                onChange={handleChange}
                placeholder='email'
                className="form__div--input"
              />
              {loginDataError.email.error ? 
                <p className="form__div--error--text">{loginDataError.email.message}</p>:
                null  
              }
            </div>
            <div className="form__div--row">
              <p className="form__div--lable">Password</p>
              <input
                type="password"
                name="password"
                id={loginDataError.password.error ? "error": ""}
                onChange={handleChange}
                placeholder='password'
                className="form__div--input login_password_input"
              />
              {loginDataError.password.error ? 
                <p className="form__div--error--text">{loginDataError.password.message}</p>:
                null  
              }
            </div>
            <div className="form__div--action">
              <button
                className='fomr__div--action--button'
                onClick={formSubmit}
                id={loading? "login_loading" : null}
              >
                Login
              </button>
              <p className="form__div--register-text">
                Don't have and account? <Link to="/signup" className='form__div--register-link'>Click here</Link> to Signup
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* dialougr for login sucess */}
      <Dialog
        open={loginSuccess}
        onClose={handleDialougClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {/* <DialogTitle id="alert-dialog-title">
          {"Use Google's location service?"}
        </DialogTitle> */}
        <DialogContent>
            <p className="login__dialougeText">
              You have successfully loggedin!
            </p>
        </DialogContent>
        <DialogActions>
          <button className='login__dialouge__button' onClick={handleDialougClose} autoFocus >
            Close
          </button>
        </DialogActions>
      </Dialog> 
    </div>
  )
}

export default Login