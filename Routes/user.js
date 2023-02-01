import express from "express";
import { body } from "express-validator";
import { isAuthorized, isLoggedin } from "../controllers/auth.js";

import { userLogin, userSignup, addWishlist, addToCart, removeWishlist, removeFromCart, updateUser, logoutUser, deleteUser } from "../controllers/user.js";

const router = express.Router();

// signup route
router.post('/signup',
    body("firstName").isLength({ min: 3 }),
    body("lastName").isLength({ min: 3 }),
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
    userSignup
)

// login route
router.post('/login',
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
    userLogin
)

// route to update user
router.put('/update/user', isLoggedin, isAuthorized, updateUser)

// route to delete the user
router.post('/delete', isLoggedin, isAuthorized, deleteUser)

// route to logout user
router.post('/logout', isLoggedin, isAuthorized, logoutUser)

// route to add product to wishlist
router.post('/wishlist/add', isLoggedin, isAuthorized, addWishlist)

// To add product to the user wishlist
router.post("/wishlist/add", isLoggedin, isAuthorized, addWishlist)

// To remove the product from user wishlist
router.post("/wishlist/remove", isLoggedin, isAuthorized, removeWishlist)

// To add the product to the user Cart
router.post("/cart/add", isLoggedin, isAuthorized, addToCart);

// To remove product from the user Cart
router.post("/cart/remove", isLoggedin, isAuthorized, removeFromCart);


export default router