import React, { useState } from 'react';
import "./Card.css";
import { useSelector, useDispatch } from 'react-redux';
import { addWishListItem, removeWishListItem, addCartItem, removeCartItem } from "../../redux/userReducer"
import { useEffect } from 'react';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from "axios";

function Card({ skeleton, product, errorFunction, errorUnloadFunction }) {
    
    const dispatch = useDispatch()
    
    const userLoginState = useSelector((state) => state.userReducer.isLoggedIn)
    const token = useSelector((state) => state.userReducer.user.accessToken)
    const userId = useSelector((state) => state.userReducer.user._id)
    const wishListState = useSelector((state) => state.userReducer.user.wishList);
    const cartListState = useSelector((state) => state.userReducer.user.cart);

    const [cardLoading, setCardLoading] = useState(false);
    const [productState, setProductState] = useState({
        _id: "",
        productName: "",
        productDes: "",
        price: "",
        productImage: "",
    })
    const [accessToken, setAccessToken] = useState("")

    const [WishList, setWishList] = useState(null);
    const [cart, setCart] = useState(null)

    useEffect(() => {
        if (!skeleton) {
            let tempDes;
            if(product.productDes.length >=38) {
                tempDes = product.productDes.slice(0, 39) + "..."
            } else {
                tempDes = product.productDes
            }
            
            setProductState({
                ...productState,
                _id: product._id,
                productName: product.productName,
                price: product.price,
                productImage: `/Images/${product.productImage}`,
                productDes: tempDes,
            })
        }

        // get access token for the user
        if(userLoginState) {
            setAccessToken(token);
        }

        // setting the wishlist and cart button default
        if(userLoginState) {
            if(wishListState.length !== 0) {
                wishListState.map(productId => {
                    if(productId === productState._id) {
                        return setWishList(true);
                    } else {
                        // return setWishList(false);
                    }
                })
            }

            if(cartListState.length !== 0) {
                cartListState.map(productId => {
                    if(productId === productState._id) {
                        return setCart(true);
                    } else {
                        // return setWishList(false);
                    }
                })
            }
        }
    }, [productState._id, cardLoading, WishList, wishListState, cart, cartListState, wishListState.length])



    const descriptionSkeleton = () => {
        return (
            <>
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-text"></div>
            </>
        )
    }

    const priceSkeleton = () => {
        return (
            <>
                <div className="skeleton skeleton-text"></div>
            </>
        )
    }

    const toggleWishList = (e) => {
        e.preventDefault(); //preventing the default action

        // check if the card is loading
        if(cardLoading) {
            return
        } else {
            let tempProductId = product._id;
            if(userLoginState) {
                setCardLoading(true);   //set the loading variable to ture

                
                // TODO: make api call to add wishlist
                return handleAddToWishList(tempProductId);
            } else {
                errorFunction();
                setTimeout(
                    () => errorUnloadFunction(),
                    5000
                );
            }
        }
    }

    const toggleCart = (e) => {
        e.preventDefault();
        // check if the card is loading 
        if(cardLoading) {
            return;
        } else {
            if(userLoginState) {
                // Function to add the item to cart
                handleAddToCart(productState._id)
            } else {
                errorFunction();
                setTimeout(
                    () => errorUnloadFunction(),
                    5000
                );
            }
        }
    }


    // function to add product to wishlist
    const handleAddToWishList = async (product_id) => {
        if(!WishList) {     //adding the product to wishlist
            // const WishListData = [...wishListState, product_id]
            let addToWishlistVariable = false;
            // check if the product is already added to the cart
            if(wishListState.length === 0) {
                addToWishlistVariable = true;
            } else {
                wishListState.map(item_id => {
                    if(item_id === product_id) {
                        addToWishlistVariable = false;
                        return;
                    } else {
                        addToWishlistVariable = true;
                    }
                })
            }
            


            // add to wishlist only if the product not already added
            if(addToWishlistVariable) {
                const testWishListData = [...wishListState, product_id];
                // axios api call to add product
                const updateData = {
                    wishListArray: testWishListData,
                    _id: userId
                }

                const config = {
                    headers: { Authorization: `Bearer ${accessToken}` }
                };
                
                

                axios.post("/api/user/wishlist/add", updateData, config).then(res => {

                    if(res.data.error) {
                        // TODO: Error handeling has to be added
                        return console.log("Some error occured");
                    }

                    // Add the product to wishlist in local user state
                    dispatch(addWishListItem({
                        products: testWishListData
                    }))
                    setWishList(true);  //setting the wishlist icon
                    setCardLoading(false);
                }).catch(err => {
                    setCardLoading(false);
                })
            } else {
                // TODO: add code to show error that its already added to the wishlist
            }
            
        } else {    //removing the product from wishlist
            // get the updated array of removed products
            const removedWishlistData = wishListState.filter((item_id) => {
                return item_id !== product_id; 
            })

            const apiSendData = {
                updatedWishlistArr: removedWishlistData,
                _id: userId
            }


            // FIXME: make the api call to remove the product
            const config = {
                headers: { Authorization: `Bearer ${accessToken}` }
            };
            
            

            axios.post("/api/user/wishlist/remove", apiSendData, config).then(res => {

                if(res.data.error) {
                    // TODO: Error handeling has to be added
                    return console.log("Some error occured");
                }

                // Add the product to wishlist in local user state
                dispatch(removeWishListItem({
                    products: removedWishlistData
                }))
                setWishList(false);  //setting the wishlist icon
                setCardLoading(false);
            }).catch(err => {
                console.log(err);
                setCardLoading(false);
            })

            // setWishList(false); //set the wishlist variabe to true 
        }
        setCardLoading(false);
    }

    const handleAddToCart = async (p_id) => {
        if(!cart) {     //adding the product to wishlist
            // const WishListData = [...wishListState, product_id]
            let addToCartVariable = false;
            // check if the product is already added to the cart

            if(cartListState.length === 0) {
                addToCartVariable = true;
            } else {
                cartListState.map(item_id => {
                    if(item_id === p_id) {
                        addToCartVariable = false;
                        return;
                    } else {
                        addToCartVariable = true;
                    }
                })
            }

            // add to wishlist only if the product not already added
            if(addToCartVariable) {
                const testCartData = [...cartListState, p_id];
                
                // api payload
                const updateData = {
                    cartArray: testCartData,
                    _id: userId
                }

                // api confid data
                const config = {
                    headers: { Authorization: `Bearer ${accessToken}` }
                };
                
                
                // api request
                axios.post("/api/user/cart/add", updateData, config).then(res => {

                    if(res.data.error) {
                        // TODO: Error handeling has to be added
                        return console.log("Some error occured");
                    }

                    dispatch(addCartItem({
                        products: testCartData
                    }))
                    setCart(true);  //setting the wishlist icon
                    setCardLoading(false);
                }).catch(err => {
                    console.log(err);
                    setCardLoading(false);
                })
            } else {
                // TODO: add code to show error that its already added to the wishlist
            }
            
        } else {    //removing the product from wishlist
            // get the updated array of removed products
            const removedCartData = cartListState.filter((item_id) => {
                return item_id !== p_id; 
            })

            // api payload
            const apiSendData = {
                cartArray: removedCartData,
                _id: userId
            }


            const config = {
                headers: { Authorization: `Bearer ${accessToken}` }
            };
            
            

            axios.post("/api/user/cart/remove", apiSendData, config).then(res => {

                if(res.data.error) {
                    // TODO: Error handeling has to be added
                    return console.log("Some error occured");
                }

                // Add the product to wishlist in local user state
                console.log(res.data.updatedUser.wishList);
                dispatch(removeCartItem({
                    products: removedCartData
                }))
                setCart(false);  //setting the wishlist icon
                setCardLoading(false);
            }).catch(err => {
                console.log(err);
                setCardLoading(false);
            })

            // setWishList(false); //set the wishlist variabe to true 
        }
    }

    return (
        <div className='card' id={cardLoading? "loadingCardId" : ""}>
            <div className="card__image--container">
                {skeleton ?
                    <div className="card__img skeleton"></div> :
                    <img src={productState.productImage} alt="" className='card__img' />
                }
            </div>
            <div className="card__content">
                <div className="card__name">
                    {skeleton ?
                        <div className="skeleton skeleton-text"></div> :
                        <p className="card__name--text">{productState.productName}</p>
                    }
                </div>
                <div className="card__des">
                    {skeleton ?
                        descriptionSkeleton() :
                        <p className="card__des--text">{productState.productDes}</p>
                        // <p className="card__des--text">Lorem ipsum dolor sit, amet consectetur...</p> //42 char
                    }
                </div>
                <div className="card__price">
                    {skeleton ?
                        priceSkeleton() :
                        <p className="card__des--text">Price: $ {productState.price}</p>
                        // <p className="card__des--text">Lorem ipsum dolor sit, amet consectetur...</p> //42 char
                    }
                </div>
                <div className="card__action">
                    {skeleton ?
                        <div className="skeleton-text skeleton"></div> :
                        <>
                            {WishList?
                                <FavoriteIcon onClick={toggleWishList} id="card__like__hollow-full"/>:
                                <FavoriteBorderIcon onClick={toggleWishList} id="card__like__hollow"/>
                            }

                            {cart?
                                <ShoppingCartIcon onClick={toggleCart} id="card__cart__button--full"/>:
                                <ShoppingCartOutlinedIcon onClick={toggleCart} id='card__cart__button'/>
                            }
                            
                        </>
                    }
                </div>
            </div>
        </div>
    )
}

export default Card