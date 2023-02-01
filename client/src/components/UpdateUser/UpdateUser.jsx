import React, { useState, useEffect } from 'react'
import './UpdateUser.css';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserReducer } from "../../redux/userReducer"
import ClearIcon from '@mui/icons-material/Clear';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import axios from "axios";

function UpdateUser({ closeUpdateDialog, user }) {
    
    const dispatch = useDispatch()
    const token = useSelector((state) => state.userReducer.user.accessToken)

    const [loading, setLoading] = useState(false)

    const [updateUser, setUpdateUser] = useState({
        firstName: user.firstName,
        lastName: user.lastName,
    })
    const [errorMsg, setErrorMsg] = useState({
        status: false,
        message: "",
    })

    const [successMsg, setSuccessMsg] = useState({
        status: false,
        message: "",
    })

    // useEffect(() => {
      
    // }, [errorMsg, successMsg])
    

    const handleInputChange =(e) => {
        e.preventDefault();
        setUpdateUser({
            ...updateUser,
            [e.target.name]: e.target.value
        })
    }

    const closeDialouge = (e) => {
        // e.preventDefault();
        closeUpdateDialog()
    }   

    const updateUserFunction = (e) => {
        e.preventDefault();

        const sendData = {
            updateUser: {
                firstName: updateUser.firstName,
                lastName: updateUser.lastName,
            },
            _id:user._id
        }

        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        // make api call to update the user
        axios.put("/api/user/update/user", sendData, config).then(res => {
            console.log(res.data)
            if(res.data.error) {
                setTimeout(() => {
                    setErrorMsg({
                        status: true,
                        message: res.data.message
                    })
                }, 3000);
            }

            // when everything is right!
            // change the redux data as well
            dispatch(updateUserReducer({
                firstName: sendData.updateUser.firstName,
                lastName: sendData.updateUser.lastName,
            }))
            // set loading to false
            setSuccessMsg({
                status: true,
                message: "User Updated Successfuly!"
            }) 
            setTimeout(() => {
                setSuccessMsg({
                    status: false,
                    message: ""
                })    
            }, 3000);
            setLoading(false);
            // set success message
            
        })
    }

    const successMessge = () => {
        return (
            <div className='update_success'>
                <p className="update_success_text">{successMsg.message}</p>
            </div>
        )
    }

    const errorMessage = () => {
        return (
            <div className='update_error'>
                <p className="update_error_text">{errorMsg.message}</p>
            </div>
        )
    }

    return (
        <>
            {successMsg.status ? successMessge() : null}
            {errorMsg.status ? errorMessage() : null}
            <DialogTitle id="alert-dialog-title">
                <p className='dialouge__heading'>Update</p>
            </DialogTitle>
            <DialogContent>
                {/* The form comes here */}
                <div className='addproduct'>
                    <div className="addproduct__horizontal">
                        <p className="addProduct--lable">First Name</p>
                        <input type="text" name='firstName' className="addProduct--input" onChange={handleInputChange} value={updateUser.firstName}/>
                        <p className="addproduct__error--text">
                            {updateUser.firstName.length < 3 ? "Minimum 3 Characters" : ""}
                        </p>
                    </div>
                    <div className="addproduct__horizontal">
                        <p className="addProduct--lable">Last Name</p>
                        <input type="text" name='lastName' className="addProduct--input" onChange={handleInputChange} value={updateUser.lastName}/>
                        <p className="addproduct__error--text">
                            {updateUser.lastName.length < 3 ? "Minimum 3 Characters" : ""}
                        </p>
                    </div>
                    
                </div>
            </DialogContent>
            <DialogActions>
                <button onClick={loading ? null : closeDialouge} className="account__action--button-cancel" id={loading ? 'addProduct__disable' : ""}>Cancel</button>
                <button onClick={loading ? null : updateUserFunction} autoFocus className='account__action--button-add' id={loading ? 'addProduct__disable' : ""}>
                    Add
                </button>
            </DialogActions>
        </>
    )
}

export default UpdateUser