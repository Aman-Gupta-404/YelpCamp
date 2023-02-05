import React, { useEffect, useState } from 'react'
import "./Accounts.css"
import userImage from "../../img/user.png"
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AddProduct from '../../components/AddProduct/AddProduct';
import { Link } from 'react-router-dom';
import UpdateUser from '../../components/UpdateUser/UpdateUser';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { logOutUser } from '../../redux/userReducer';

function Accounts() {
    const dispatch = useDispatch()

    const user = useSelector((state) => state.userReducer.user)
    const token = useSelector((state) => state.userReducer.user.accessToken)

    const [userState, setUserState] = useState({ ...user })
    const [addProductDialoug, setAddProductDialoug] = useState(false);
    const [updateUserDialouge, setUpdateUserDialouge] = useState(false)
    const [logoutDialog, setLogoutDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState(false);

    useEffect(() => {
        setUserState({ ...user })
    }, [user.firstName, user.lastName])


    const openAddProducts = (e) => {
        e.preventDefault();
        setAddProductDialoug(true);
    }

    const openUpdateDialog = (e) => {
        e.preventDefault();
        setUpdateUserDialouge(true);
    }

    const closeAddProducts = (e) => {
        // e.preventDefault();
        setAddProductDialoug(false);
    }

    const closeUpdateDialoge = (e) => {
        // e.preventDefault();
        setUpdateUserDialouge(false);
    }

    const logoutUserFunction = (e) => {
        e.preventDefault();

        const payload = {
            _id: user._id
        }
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        console.log(token)
        // make api call to logout the user
        // axios.put("/api/user/logout", { data: payload, headers: { Authorization: `Bearer ${token}` } }).then(res => {
        axios.post("/api/user/logout", payload, config).then(res => {
            if(res.data.error) {
                // set the variables for a failed logout
                setErrorMsg(true);
                setTimeout(() => {
                    setErrorMsg(false)
                }, 3000);
            } else {
                // clear the data
                dispatch(logOutUser());
                setLogoutDialog(false);
            }

        })
    }

    const OpenLogoutDialog = () => {
        setLogoutDialog(true)
    }

    const closeLogoutDialog = () => {
        setLogoutDialog(false)
    }

    const OpenDeleteDialog = () => {
        setDeleteDialog(true)
    }

    const closeDeleteDialog = () => {
        setDeleteDialog(false)
    }

    const AccountDeleteFunction = () => {
        const payload = {
            _id: user._id
        }
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        // make the api call to delete the account
        axios.post("/api/user/delete", payload, config).then(res => {
            if(res.data.error) {
                // set the variables for a failed logout
                setErrorMsg(true);
                setTimeout(() => {
                    setErrorMsg(false)
                }, 3000);
            } else {
                // clear the data
                dispatch(logOutUser());
                setDeleteDialog(false);
            }

        })
        // logout the user
    }

    const logoutDialogBox = () => {
        return (
            <Dialog
                open={logoutDialog}
                onClose={closeLogoutDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <DialogTitle id="alert-dialog-title">
                        <p className='dialouge__heading'>Alert</p>
                    </DialogTitle>
                    <DialogContent>
                        <p className='dialouge__text'>Are you sure you want to logout?</p>
                    </DialogContent>
                    <DialogActions>
                        <button onClick={loading ? null : closeLogoutDialog} className="account__action--button-cancel" id={loading ? 'addProduct__disable' : ""}>cancel</button>
                        <button onClick={loading ? null : logoutUserFunction} autoFocus className='account__action--button-add' id={loading ? 'addProduct__disable' : ""}>
                            Logout
                        </button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        )
    }

    const deleteDialogBox = () => {
        return (
            <Dialog
                open={deleteDialog}
                onClose={closeDeleteDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <DialogTitle id="alert-dialog-title">
                        <p className='dialouge__heading'>Alert</p>
                    </DialogTitle>
                    <DialogContent>
                        <p className='dialouge__text'>Are you sure you want to Delete your account?</p>
                        <p className='dialouge__text'>You cannot recover your account back!</p>
                    </DialogContent>
                    <DialogActions>
                        <button onClick={loading ? null : closeDeleteDialog} className="account__action--button-cancel" id={loading ? 'addProduct__disable' : ""}>cancel</button>
                        <button onClick={loading ? null : AccountDeleteFunction} autoFocus className='account__action--button-add' id={loading ? 'addProduct__disable' : ""}>
                            Delete
                        </button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        )
    }

    const errorMessage = () => {
        return (
            <div className="account_error">
                <p className="account_error_text">There was some error, please try again!</p>
            </div>
        )
    }

    return (
        <>
        {errorMsg ? errorMessage() : null}
        <div className='accounts'>
            <div className="accounts__section">
                <div className="accounts__left">

                    <div className="accounts__userImage">
                        <div className="accounts__user--hr"></div>
                        <div className="accounts__user--container">
                            <img src={userImage} alt="user Image" className="accounts__user--image" />
                        </div>
                    </div>

                    <div className="accounts__user--details">
                        <div className="account__user--container">
                            <p className="account__user--text">
                                First Name: {userState.firstName}
                            </p>
                        </div>
                        <div className="account__user--container">
                            <p className="account__user--text">
                                Last Name: {userState.lastName}
                            </p>
                        </div>
                        <div className="account__user--container">
                            <p className="account__user--text">
                                Email: {userState.email}
                            </p>
                        </div>
                        <div className="account__user--action">
                            <button className='account__user--action--button--delete' onClick={OpenLogoutDialog}>Logout User</button>
                            <button className='account__user--action--button--update' onClick={openUpdateDialog}>Update User</button>
                        </div>
                    </div>
                </div>
                <div className="accounts__right">
                    <div className="account__right--horizontal--heading">
                        <p className="account__right--heading--text">Advanced Options</p>
                    </div>

                    {/* <div className="account__right--horizontal" onClick={openAddProducts}>
                        <p className="account__right--text">Add Products</p>
                    </div>
                    <Link to="/products/manage" className="account__right--horizontal">
                        <p className="account__right--text">Manage Products</p>
                    </Link> */}
                    <Link to="/cart" className="account__right--horizontal">
                        <p className="account__right--text">Cart</p>
                    </Link>
                    <div className="account__right--horizontal" onClick={OpenDeleteDialog}>
                        <p className="account__right--text">Delete Account</p>
                    </div>
                </div>
            </div>

            {/* dialouge to add product */}
            <Dialog
                open={addProductDialoug}
                onClose={closeAddProducts}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <AddProduct toggleDialouge={closeAddProducts} />
                </DialogContent>
            </Dialog>

            {/* dialoge for updating the user */}
            <Dialog
                open={updateUserDialouge}
                onClose={closeUpdateDialoge}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <UpdateUser closeUpdateDialog={closeUpdateDialoge} user={{ firstName: userState.firstName, lastName: userState.lastName, _id: userState._id }} />
                </DialogContent>
            </Dialog>

            {/* logout dialog */}
            {logoutDialogBox()}

            {/* Delete dialog */}
            {deleteDialogBox()}

        </div>
        </>
    )
}

export default Accounts