import YelpUser from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { createAccessToken, createRefreshToken } from "./utils/token.js";

export const userSignup = async (req, res) => {
    // validating the inputs form express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
        const newUserData = req.body;   //getting the user data

        // check if the user already exists
        YelpUser.findOne({ email: newUserData.email }, async function(err, user) {
            if(!user) {
                // creating user instance
                const newUser = await new YelpUser(newUserData);

                // saving the user in database
                const saveUser = await newUser.save();
        
                return res.status(200).json({
                    error: false,
                    SignupSuccess: true,
                });
            } else {
                return res.status(405).json({
                    error: true,
                    message: "Email is already in use, please use some other email"
                })
            }
        })

    } catch (err) {
        // return error message
        return res.status(500).json({
            error: true,
            message: "internal server error!"
        })
    }

    // TODO: Login user
}

export const userLogin = async (req, res) => {
    // login the user using this function

    // check for any errors in the validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const loginDetails = req.body;

    // search for the user in database
    YelpUser.findOne({email: loginDetails.email}, async function(err, user) {
        // check for errors
        if(err) {
            return res.status(500).json({
                error: true,
                message: err
            })
        }

        if(!user) {
            return res.status(400).json({
                error: true,
                message: "User not found"
            })
        }

        // validate password
        const passwordFlag = await bcrypt.compare(loginDetails.password, user.password);
        
        // Generating access and refresh token
        const AuthToken = createAccessToken(user);
        const refreshToken = createRefreshToken(user);

        // sending refresh token via cookies
        res.cookie("yelprefjid", refreshToken, { httpOnly: true, maxAge: 60000 * 60 * 24 * 7 });

        // Send the user to the client
        if(passwordFlag) {
            return res.status(200).json({
                error: false,
                message: "user Login Successful",
                user: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    wishList: user.wishList,
                    cart: user.cart,
                    authToken: AuthToken
                }
            })
        } else {
            return res.status(401).json({
                error: false,
                message: "Wrong password"
            })
        }
    })
}

export const updateUser = async (req, res) => {

    // const wishListArr = req.body.updatedUser.wishListArray;
    // const updatedUser = req.body.updateUser;

    const updatedUserData = {
        firstName: req.body.updateUser.firstName,
        lastName: req.body.updateUser.lastName
    };
    
    console.log(updatedUserData)
    // update the user model
    YelpUser.findByIdAndUpdate(req.body._id, updatedUserData, async function(err, updatedUser) {
        if(err) {
            return res.status(304).json({
                error: true,
                message: "Couldn't update user"
            })
        }

        return res.status(200).json({
            error: false,
            message: "User Updated!",
            updatedUser: updatedUser
        })
    })
}

// logout user
export const logoutUser = async (req, res) => {
    const _id = req.body._id
    YelpUser.findOne({_id: _id}, async function(err, user) {
        // check for errors
        if(err) {
            return res.status(500).json({
                error: true,
                message: err
            })
        }

        if(!user) {
            return res.status(400).json({
                error: true,
                message: "User not found"
            })
        }
        // log out user by clearing the refresh token
        res.clearCookie("yelprefjid");

        return res.status(200).json({
            error: false,
            message: "user Login out Successful",
        })
    })
}

export const deleteUser = (req, res) => {
    YelpUser.findByIdAndDelete(req.body._id, async function(err, user) {
        if(err) {
            return res.status(400).json({
                error: true,
                message: "Some error occured"
            })
        } else {
            // remove the cookies
            res.clearCookie("yelprefjid");
            return res.status(200).json({
                error: false,
                message: "User accound deleted successfully!"
            })
        }
    })
}

// add product to wishlist
export const addWishlist = async (req, res) => {
    // get the product ID from the request
    const ProductId = req.body.productId;
    // const wishListArr = req.body.updatedUser.wishListArray;
    const wishListArr = req.body.wishListArray;
    
    
    // update the user model
    YelpUser.findByIdAndUpdate(req.body._id, { wishList: wishListArr }, async function(err, updatedUser) {
        if(err) {
            return res.status(304).json({
                error: true,
                message: "Couldn't add product to wish list!"
            })
        }

        return res.status(200).json({
            error: false,
            message: "Product added to wishlist",
            updatedUser: {
                wishList: updatedUser.wishList,
                user: updatedUser
            }
        })
    })
}

export const removeWishlist = async (req, res) => {
    // get the product ID from the request
    const ProductId = req.body.productId;
    // const wishListArr = req.body.updatedUser.wishListArray;
    const wishListArr = req.body.updatedWishlistArr;
    
    
    // update the user model
    YelpUser.findByIdAndUpdate(req.body._id, { wishList: wishListArr }, async function(err, updatedUser) {
        if(err) {
            return res.status(304).json({
                error: true,
                message: "Couldn't remove product from wish list!"
            })
        }

        return res.status(200).json({
            error: false,
            message: "Product removed from wishlist",
            updatedUser: {
                wishList: updatedUser.wishList,
                user: updatedUser
            }
        })
    })
}

// add product to wishlist
export const addToCart = async (req, res) => {

    // const wishListArr = req.body.updatedUser.wishListArray;
    const cartArr = req.body.cartArray;
    
    
    // update the user model
    YelpUser.findByIdAndUpdate(req.body._id, { cart: cartArr }, async function(err, updatedUser) {
        if(err) {
            return res.status(304).json({
                error: true,
                message: "Couldn't add product to Cart!"
            })
        }

        return res.status(200).json({
            error: false,
            message: "Product added to cart",
            updatedUser: updatedUser
        })
    })
}

export const removeFromCart = async (req, res) => {

    // const wishListArr = req.body.updatedUser.wishListArray;
    const cartArr = req.body.cartArray;
    
    
    // update the user model
    YelpUser.findByIdAndUpdate(req.body._id, { cart: cartArr }, async function(err, updatedUser) {
        if(err) {
            return res.status(304).json({
                error: true,
                message: "Couldn't remove product from Cart!"
            })
        }

        return res.status(200).json({
            error: false,
            message: "Product removed from cart",
            updatedUser: updatedUser
        })
    })
}
