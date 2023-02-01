import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeCartItem } from "../../redux/userReducer"
import "./Cart.css"
import EmptyTentImg from "../../img/tent.png"
import { Link } from 'react-router-dom';

function Cart() {
    const userLoginState = useSelector((state) => state.userReducer.isLoggedIn);
    const cartListState = useSelector((state) => state.userReducer.user.cart);
    const token = useSelector((state) => state.userReducer.user.accessToken);
    const userId = useSelector((state) => state.userReducer.user._id);
    const dispatch = useDispatch();

    const [skeleton, setSkeleton] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState(false)
    const [errorMsg, setErrorMsg] = useState(false)
    const [initialRun, setInitialRun] = useState(true);


// populating the data from the database 
    useEffect(() => {
        if(initialRun) {
            if(cartItems.length < cartListState.length) {
                setLoading(true);
                populateCartData();
            }
            setInitialRun(false);
        }
    }, [cartItems, loading, successMsg, errorMsg])
    
    const populateCartData = async () => {
        // making an api call to get all the data
        await axios.get("/api/product/get/all").then(res => {
            if (res.data.error) {
                // return setFetchError(true);
            }
            let ActualCartArray = []
            const tempArr = res.data.products
            // checking if the the product is in the user cart
            console.log(tempArr)
            if(tempArr.length !== 0) {
                tempArr.map(item => { //1 2 3 4
                    // console.log("map item from api: ", item._id)
                    if(cartListState !== 0) {
                        cartListState.map(productId => {  //2 3
                            // console.log("Map item from cartState: ", productId)
                            if(productId === item._id) {
                                // setCartItems([...cartItems, item]);
                                ActualCartArray = [...ActualCartArray, item];
                                return;
                            } else return
                        })
                    }
                })
                setCartItems([...ActualCartArray])
            }
        })
        setLoading(false)
    }

    const getTotalPrice = () => {
        let price = 0;
        if(cartItems.length !== 0) {
            cartItems.map(item => {
                price = price + item.price;
            })
        }
        return price;
    }

    const removeCart = async (e) => {
        e.preventDefault();
        const tempId = e.target.name;
        console.log("Item to be removed: ", e.target.name);

        const updatedCartArray = cartListState.filter((item_id) => {
            return item_id !== tempId; 
        })

        console.log("updated Array: ", updatedCartArray)
        // TODO:
        // remove the item from database using api call
        const apiSendData = {
            cartArray: updatedCartArray,
            _id: userId
        }

        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        
        axios.post("/api/user/cart/remove", apiSendData, config).then(res => {
            console.log("Res is: ", res)
            if(res.data.error) {
                // TODO: Error handeling has to be added
                return console.log("Some error occured");
            }

            // Remove the item from the local variable
            const tempLocalVariableArray = cartItems.filter((item) => {
                return item._id !== tempId;
            });
            setCartItems(tempLocalVariableArray);

            // Remove the item from local storage
            dispatch(removeCartItem({
                products: updatedCartArray
            }))

            // showing the success message to the user 
            setSuccessMsg(true);
            setTimeout(() => {
                setSuccessMsg(false);
            }, 5000);
        }).catch(err => {
            console.log(err);
            setErrorMsg(true);
            setTimeout(() => {
                setErrorMsg(false);
            }, 5000);
        })

        

    }

    const successMessage = (e) => {
        return (
            <div className="cartPage_success">
                <p className="cart_success_text">The product removed from cart</p>
            </div>
        )
    }

    const errorMessage = (e) => {
        return (
            <div className="cartPage_error">
                <p className="cart_error_text">There was some error, please try again</p>
            </div>
        )
    }


    const noProductRender = () => {
        if(!loading) {
            return (
                <div className='no_product_render_cart'>
                    <img src={EmptyTentImg} className="cart_noProductImage"/>
                    <p className='cart_text_head'>Opps!</p>
                    <p className='cart_text'>you dont have any thing in cart, please add it from shop!</p>
                    <Link to='/shop'>
                        <button className="cart_button">Shop</button>
                    </Link>
                </div>
            )
        } else {
            return null
        }
    }

  return (
    <div className='cart_page'>
        <div className="cart_page--heading">
            <h1 className="cart_page--heading--text">Cart</h1>
        </div>
        {successMsg? successMessage(): null}
        {errorMsg? errorMessage(): null}
        {cartListState.length === 0 ? 
            noProductRender():
            <div className="cart_page_container" id={loading ? "cartPageLoading" : null}>
                {cartItems.map((item, index) => {
                    return (
                            <div className="cart_page_item_box" key={index}>
                                <div className="cart_page_item_box_left">
                                    <div className="cart_page_image_div">
                                        <img src={`/Images/${item.productImage}`} alt="" className='cart_page_image'/>
                                    </div>
                                    <div className="cart_page_name">
                                        <p className="cart_page_text">
                                            {item.productName}
                                        </p>
                                    </div>
                                </div>
                                <div className="cart_page_item_box_right">
                                    <div className="cart_page_removeButton">
                                        <button className="cart_action_remove_button" name={item._id} onClick={removeCart}>
                                            Remove
                                        </button>
                                    </div>
                                    <div className="cart_page_price">
                                        <p className="cart_page_text">
                                            Price: ${item.price}
                                        </p>
                                    </div>
                                </div>
                            </div>
                    )
                })}
                <div className="cart_page_item_box_total">
                    <div className="cart_page_item_box_total_left">
                        <p className="cart_page_text">Total</p>
                    </div>
                    <div className="cart_page_item_box_total_right">
                        <p className="cart_page_text">{getTotalPrice()}</p>
                        {/* <button onClick={testFunction}>Check</button> */}
                    </div>
                </div>
            </div>
        }
    </div>
  )
}

export default Cart