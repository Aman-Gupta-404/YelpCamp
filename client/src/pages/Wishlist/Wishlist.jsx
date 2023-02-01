import React from 'react';
import "./Wishlist.css";
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeWishListItem, addCartItem } from "../../redux/userReducer"
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import EmptyTentImg from "../../img/tent.png";
import { Link } from 'react-router-dom';

function Wishlist() {
    const wishListState = useSelector((state) => state.userReducer.user.wishList);
    const cartListState = useSelector((state) => state.userReducer.user.cart);
    const token = useSelector((state) => state.userReducer.user.accessToken);
    const userId = useSelector((state) => state.userReducer.user._id);
    const dispatch = useDispatch();

    const [wishlistItems, setWishlistItems] = useState([]);
    const [cartList, setCartList] = useState([])
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState({
        status: false,
        message: ""
    })
    const [errorMsg, setErrorMsg] = useState({
        status: false,
        message: ""
    })
    const [initialRun, setInitialRun] = useState(true);
    const [unavailableProduct, setUnavailableProduct] = useState(0);

    // populating the data from the database 
    useEffect(() => {
        setCartList(cartListState);
        if (initialRun) {
            if (wishlistItems.length < wishListState.length) {
                setLoading(true);
                populateWishlistData();
            }
            setInitialRun(false)
        }
    }, [wishlistItems, wishListState.length, cartListState.length, cartList, successMsg, errorMsg])

    const populateWishlistData = async () => {
        // making an api call to get all the data
        await axios.get("/api/product/get/all").then(res => {
            if (res.data.error) {
                // return setFetchError(true);
            }
            let ActualWishlistArray = []
            const tempArr = res.data.products

            // checking if the the product is in the user cart
            if (tempArr.length !== 0) {
                tempArr.map(item => { //1 2 3 4
                    // console.log("map item from api: ", item._id)
                    if (wishListState !== 0) {
                        wishListState.map(productId => {  //2 3
                            // console.log("Map item from cartState: ", productId)
                            if (productId === item._id) {
                                // setCartItems([...cartItems, item]);
                                ActualWishlistArray = [...ActualWishlistArray, item];
                                return;
                            } else {
                                // do something that will remove the item from wishlist

                            }
                        })
                    }
                })
                setWishlistItems([...ActualWishlistArray])
            }
        })
        setLoading(false)
    }

    const removeWishListItemFun = async (e) => {
        // get the updated wishlist array
        const activeID = e.target.name;
        const tempWishlistArr = wishListState.filter(item => {
            console.log(item, activeID)
            return item !== activeID
        })
        console.log(tempWishlistArr);

        const apiSendData = {
            updatedWishlistArr: tempWishlistArr,
            _id: userId
        }


        // FIXME: make the api call to remove the product
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        // const localVarUpdate = wishlistItems.filter(W_item => {
        //     return W_item._id !== activeID;
        // })

        // setWishlistItems([...localVarUpdate]);

        axios.post("/api/user/wishlist/remove", apiSendData, config).then(res => {
            console.log("Res is: ", res)
            if (res.data.error) {
                // TODO: Error handeling has to be added
                console.log("Some error occured");
                setErrorMsg({
                    status: true,
                    message: "Some Error occured, please try again"
                })
                setInterval(() => {
                    setErrorMsg({
                        status: false,
                        message: ""
                    })
                }, 5000);
                return
            }

            // updating the redux variable
            dispatch(removeWishListItem({
                products: tempWishlistArr
            }))

            // updating the local variable
            const localVarUpdate = wishlistItems.filter(W_item => {
                return W_item._id !== activeID;
            })
            setWishlistItems([...localVarUpdate]);

            setSuccessMsg({
                status: true,
                message: "Product removed from wishlist"
            })
            setInterval(() => {
                setSuccessMsg({
                    status: false,
                    message: ""
                })
            }, 3000);

        }).catch(err => {
            console.log(err);
            setErrorMsg({
                status: true,
                message: "Some Error occured, please try again"
            })
            setInterval(() => {
                setErrorMsg({
                    status: false,
                    message: ""
                })
            }, 5000);
        })
        // until here uncomment
    }

    const addToCartFun = (e) => {
        e.preventDefault();
        setLoading(true);

        const product_id = e.target.name;
        const tempArray = [...cartListState, product_id]


        const updateData = {
            cartArray: tempArray,
            _id: userId
        }

        // api confid data
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };


        // api request
        axios.post("/api/user/cart/add", updateData, config).then(res => {
            console.log("Res is: ", res)
            if (res.data.error) {
                // TODO: Error handeling has to be added
                setLoading(false);
                return console.log("Some error occured");
            }

            dispatch(addCartItem({
                products: tempArray
            }))

            setCartList([...tempArray])

            setSuccessMsg({
                status: true,
                message: "The product is added to the Cart!"
            });
            setTimeout(() => {
                setSuccessMsg({
                    status: false,
                    message: ""
                })
            }, 3000);
            setLoading(false);
        }).catch(err => {
            console.log(err);
            setErrorMsg({
                status: true,
                message: "There was some error, please try again!"
            });
            setTimeout(() => {
                setErrorMsg({
                    status: false,
                    message: ""
                })
            }, 3000);
            setLoading(false)
        })
    }

    const addToCartDisabled = (e) => {
        e.preventDefault();
        setErrorMsg({
            status: true,
            message: "The product is already in Cart!"
        });
        setTimeout(() => {
            setErrorMsg({
                status: false,
                message: ""
            })
        }, 3000);
    }

    const successMessage = (e) => {
        return (
            <div className="cartPage_success">
                <p className="cart_success_text">{successMsg.message}</p>
            </div>
        )
    }

    const errorMessage = (e) => {
        return (
            <div className="cartPage_error">
                <p className="cart_error_text">{errorMsg.message}</p>
            </div>
        )
    }

    const addToCartButton = (id) => {
        let addCartFlag = false;
        if (cartListState.length !== 0) {
            cartListState.map(item_id => {
                if (item_id === id) {
                    addCartFlag = true;
                    return;
                }
            })
        }

        if (!addCartFlag) {
            return (
                <button className="wish_action_add_button" name={id} onClick={addToCartFun}>
                    Add to
                    <ShoppingCartOutlinedIcon id="wishlist_button_icon" />
                </button>
            )
        } else {
            return (
                <button className="wish_action_add_button-dissabled" name={id} onClick={addToCartDisabled}>
                    In cart
                </button>
            )
        }
    }

    const noProductRender = () => {
        if (!loading) {
            return (
                <div className='no_product_render_wish'>
                    <img src={EmptyTentImg} className="wishlist_noProductImage" />
                    <p className='wishlist_text_head'>Opps!</p>
                    <p className='wishlist_text'>Looks like you dont have any items in wishlist, add them from shop!</p>
                    <Link to='/shop'>
                        <button className="wishlist_button">Shop</button>
                    </Link>
                </div>
            )
        } else {
            return null
        }
    }

    return (
        <div className='wish_page'>
            <div className="wish_page--heading">
                <h1 className="wish_page--heading--text">Wishlist</h1>
            </div>
            {successMsg.status ? successMessage() : null}
            {errorMsg.status ? errorMessage() : null}
            {wishListState.length === 0 ?
                noProductRender() :
                <div className="wish_page_container" id={loading ? "wishPageLoading" : null}>
                    {wishlistItems.map((item, index) => {
                        return (
                            <div className="wish_page_item_box" key={index}>
                                <div className="wish_page_item_box_left">
                                    <div className="wish_page_image_div">
                                        <img src={`/Images/${item.productImage}`} alt="" className='wish_page_image' />
                                    </div>
                                    <div className="wish_page_name">
                                        <p className="wish_page_text">
                                            {item.productName}
                                        </p>
                                    </div>
                                </div>
                                <div className="wish_page_item_box_right">
                                    <div className="wish_page_removeButton">
                                        <button className="wish_action_remove_button" name={item._id} onClick={removeWishListItemFun}>
                                            Remove
                                        </button>
                                    </div>
                                    <div className="wish_page_price">
                                        {addToCartButton(item._id)}
                                        {/* <button className="wish_action_add_button" name={item._id}>
                                            Add to 
                                            <ShoppingCartOutlinedIcon id="wishlist_button_icon"/>
                                        </button> */}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    {/* <div className="wish_page_item_box_total">
                    <div className="wish_page_item_box_total_left">
                        <p className="wish_page_text">Total</p>
                    </div>
                    <div className="wish_page_item_box_total_right">
                        <button onClick={() => console.log(wishlistItems, wishListState)} className="wish_page_text">price</button>
                    </div>
                </div> */}
                </div>
            }
        </div>
    )
}

export default Wishlist