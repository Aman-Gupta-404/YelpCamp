import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import "./Signup.css";
import img from "../../img/camping.gif";
import { check } from 'express-validator';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useDispatch } from 'react-redux';
import { loginUser } from "../../redux/userReducer"

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

function Signup() {
  const dispatch = useDispatch()
  const [loginData, setLoginData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    isSeller: false
  });

  const [loading, setLoading] = useState(false)

  const [submissionError, setSubmissionError] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const [loginDataError, setLoginDataError] = useState({
    firstName: {
      error: false,
      message: "",
    },
    lastName: {
      error: false,
      message: "",
    },
    email: {
      error: false,
      message: "",
    },
    password: {
      error: false,
      message: "",
    },
  });

  // functions to validate the inputs
  const validateEmail = (email) => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
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
    if (e.target.name === "email") {
      setLoginDataError({
        ...loginDataError,
        email: {
          ...loginDataError.email,
          error: false,
          message: "",
        }
      })
    } else if (e.target.name === "password") {
      setLoginDataError({
        ...loginDataError,
        password: {
          ...loginDataError.password,
          error: false,
          message: "",
        }
      })
    } else if (e.target.name === "firstName") {
      setLoginDataError({
        ...loginDataError,
        firstName: {
          ...loginDataError.firstName,
          error: false,
          message: "",
        }
      })
    } else if (e.target.name === "lastName") {
      setLoginDataError({
        ...loginDataError,
        lastName: {
          ...loginDataError.lastName,
          error: false,
          message: "",
        }
      })
    }

    // set the values
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    })
  };

  // toggle button function
  const handleToggle = (e) => {
    console.log(e.target)
    if(loginData.isSeller) {
      setLoginData({
        ...loginData,
        isSeller: false
      })
    } else {
      setLoginData({
        ...loginData,
        isSeller: true
      })
    }
  }

  // function to handle form submit
  const formSubmit = async (e) => {
    e.preventDefault();
    // set loading variable to true
    setLoading(true);
    // check if the inputs are empty
    if (loginData.email === "" ||
      loginData.password === "" ||
      loginData.firstName === "" ||
      loginData.lastName === ""
    ) {
      // check for both
      if (loginData.email === "" &&
        loginData.password === "" &&
        loginData.firstName === "" &&
        loginData.lastName === ""
      ) {
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
          },
          firstName: {
            ...loginDataError.firstName,
            error: true,
            message: "Please enter your first name"
          },
          lastName: {
            ...loginDataError.lastName,
            error: true,
            message: "Please enter your last name"
          },
        })
      } else {

        // check for email
        if (loginData.email === "") {
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
        if (loginData.password === "") {
          setLoginDataError({
            ...loginDataError,
            password: {
              ...loginDataError.password,
              error: true,
              message: "Please enter your password!"
            }
          })
        }
        // check for firstName
        if (loginData.firstName === "") {
          setLoginDataError({
            ...loginDataError,
            firstName: {
              ...loginDataError.firstName,
              error: true,
              message: "Please enter your first name!"
            }
          })
        }
        if (loginData.lastName === "") {
          setLoginDataError({
            ...loginDataError,
            lastName: {
              ...loginDataError.lastName,
              error: true,
              message: "Please enter your last name!"
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

    if (emailFlagIs) {
      if (!loginDataError.email.error && !loginData.password.error) {
        // TODO: signup the user
        const postRequestUserData = {
          firstName: loginData.firstName,
          lastName: loginData.lastName,
          email: loginData.email,
          password: loginData.password,
          wishList: [],
          cart: [],
          isSeller: loginData.isSeller,
        }

        // make the api request
        axios.post("/api/user/signup", postRequestUserData).then(res => {
          console.log("here 1")
          if (res.data.error) {
            let tempMessage;
            console.log("here: ", res.data)
            if(res.data.message && res.data.message !== ""){
              tempMessage = res.data.message;
            } else {
              tempMessage = "There was some error, please try again!"
            }
            return setSubmissionError({
              error: true,
              message: tempMessage,
            });
          }
          setSubmissionSuccess(true);
          return setLoading(false)
        }).catch(err => {
          console.log(err.response.data)
          if(err.response.data.message&& err.response.data.message !== "") {
            setSubmissionError({
              error: true,
              message: err.response.data.message,
            })  
          } else {
            setSubmissionError({
              error: true,
              message: "There was some error, please try again!",
            })
          }
          setLoading(false);
          return;
        })
      }
    } else {
      setLoading(false)
    }
  };

  // cosnt handle all dialouge close functions
  const handleCloseErrorDialoge = (e) => {
    e.preventDefault();

    setLoginData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      isSeller: false
    });

    setSubmissionError({
      error: false,
      message: "",
    });
  }

  const handleCloseSuccessDialoge = (e) => {
    setSubmissionSuccess(false);
  }

  return (
    <div className='login'>
      <div className="login__box">
        <div className="login__box--left">
          <img src={img} alt="" className='login__box--img' />
        </div>
        <div className="login__box--right">
          <div className="form__div">
            <div className="form__div--heading">
              <p className="form__div--heading--text">Signup</p>
            </div>

            {/* Row two */}
            <div className="form__div--row--signup">

              {/* First Name */}
              <div className="form__div--row--sec">
                <p className="form__div--lable">First Name</p>
                <input
                  type="text"
                  name="firstName"
                  id={loginDataError.firstName.error ? "error" : ""}
                  onChange={handleChange}
                  value={loginData.firstName}
                  placeholder='firstName'
                  className="form__div--input"
                />
                {loginDataError.firstName.error ?
                  <p className="form__div--error--text">{loginDataError.firstName.message}</p> :
                  null
                }
              </div>

              {/* Last name */}
              <div className="form__div--row--sec">
                <p className="form__div--lable">Last Name</p>
                <input
                  type="text"
                  name="lastName"
                  id={loginDataError.lastName.error ? "error" : ""}
                  onChange={handleChange}
                  value={loginData.lastName}
                  placeholder='lastName'
                  className="form__div--input"
                />
                {loginDataError.lastName.error ?
                  <p className="form__div--error--text">{loginDataError.lastName.message}</p> :
                  null
                }
              </div>
            </div>

            {/* Row two */}
            <div className="form__div--row--signup">
              <div className="form__div--row--sec">
                <p className="form__div--lable">Email</p>
                <input
                  type="text"
                  name="email"
                  id={loginDataError.email.error ? "error" : ""}
                  onChange={handleChange}
                  value={loginData.email}
                  placeholder='email'
                  className="form__div--input"
                />
                {loginDataError.email.error ?
                  <p className="form__div--error--text">{loginDataError.email.message}</p> :
                  null
                }
              </div>

              {/* Last name */}
              <div className="form__div--row--sec">
                <p className="form__div--lable">Password</p>
                <input
                  type="password"
                  name="password"
                  id={loginDataError.password.error ? "error" : ""}
                  onChange={handleChange}
                  value={loginData.password}
                  placeholder='password'
                  className="form__div--input signup_password_input"
                />
                {loginDataError.password.error ?
                  <p className="form__div--error--text">{loginDataError.password.message}</p> :
                  null
                }
              </div>
            </div>

            {/* row three */}
            <div className="form__div--row--signup">
              <div className="form__div--row--sec">
                <p className="form__div--lable">Be a seller?</p>
                <div className="toggle__div">


                  <FormControlLabel
                    onChange={handleToggle}
                    value={loginData.isSeller}
                    name="isSeller"
                    control={<IOSSwitch sx={{ m: 1 }} />}
                    label=""
                  />
                </div>
                {/* {loginDataError.email.error ?
                  <p className="form__div--error--text">{loginDataError.email.message}</p> :
                  null
                } */}
              </div>
            </div>

            {/* action section */}
            <div className="form__div--action">
              {loading ? <button
                className='fomr__div--action--button-loading'
              >
                Sign up
              </button> :
                <button
                  className='fomr__div--action--button'
                  onClick={formSubmit}
                >
                  Sign up
                </button>
              }
              <p className="form__div--register-text">
                Already have and account? <Link to="/login" className='form__div--register-link'>Click here</Link> to Login
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* error message for signup failure */}
      {submissionError.error? 
        <Dialog
          open={submissionError.error}
          onClose={handleCloseErrorDialoge}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
          <p className="text_para bold">Oops!</p>
          </DialogTitle>
          <DialogContent>
            <p className="text_para">{submissionError.message}</p>
          </DialogContent>
          <DialogActions>
            {/* <Button onClick={handleCloseErrorDialoge}></Button> */}
            <button className='signup_dialoge_action' onClick={handleCloseErrorDialoge} autoFocus>
              close
            </button>
          </DialogActions>
        </Dialog>: null
      }

      {/* FIXME:  */}
      {submissionSuccess? 
        <Dialog
          open={submissionSuccess}
          onClose={handleCloseSuccessDialoge}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
          <p className="text_para bold">Yayy!</p>
          </DialogTitle>
          <DialogContent>
            <p className="text_para">You'r account has been created, please Login to your account </p>
          </DialogContent>
          <DialogActions>
            {/* <Button onClick={handleCloseErrorDialoge}></Button> */}
            <button className='signup_dialoge_action' onClick={handleCloseErrorDialoge} autoFocus>
              close
            </button>
            <Link to="/login" className='signup_dialoge_action_link'>
              <button className='signup_dialoge_action' autoFocus>
                Login
              </button>
            </Link>
          </DialogActions>
        </Dialog>: null
      }
    </div>
  )
}

export default Signup