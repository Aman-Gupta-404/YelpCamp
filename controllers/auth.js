import { verifyAccessToken, verifyRefreshToken, createRefreshToken, createAccessToken } from "./utils/token.js";
import YelpUser from "../models/user.js";

export const isLoggedin = (req, res, next) => {
    const authToken = req.headers.authorization;
    console.log(req.headers)
    if(!authToken) {
        return res.status(401).json({
            error: true,
            message: "User unauthorized!"
        })
    }

    const token = req.headers.authorization.split(" ")[1];

    try {
        // verify the token
        const flag =  verifyAccessToken(token);
        
        if(flag) {
            req.auth = {
                _id: flag.data
            }
            return next()
        } else {
            return res.status(400).json({
                error: true,
                message: "User not loggedin"
            })
        }
    } catch (err) {
        res.status(500).json({
            error: true,
            message: err
        })
    }
}

export const isAuthorized = (req, res, next) => {
    const authFlag = req.auth && req.body && req.auth._id === req.body._id;
    console.log(req.auth, req.body)
    if(authFlag) {
        return next()
    } else {
        return res.status(401).json({
            error: true,
            message: "User not authorized"
        })
    }
}

export const refreshAccessToken = async (req, res) => {
    // get the refreshtoken from the request!
    const reqRefToken = req.cookies.yelprefjid;

    
    // check if the 
    const flag = await verifyRefreshToken(reqRefToken)
    if(flag) {

        // find the user in the database
        YelpUser.findOne({ _id: flag.data }, async function(err, user) {
            if(!user || err) {

                // log out user by clearing the refresh token
                res.clearCookie("yelprefjid");

                // send the no wrong error
                return res.status(200).json({
                    error: true,
                    refreshUser: false,
                });

            } else if(user) {
                // create the user
                const refreshToken = createRefreshToken(user);
                const AuthToken = createAccessToken(user);

                // res.cookie("yelprefjid", refreshToken, { httpOnly: true, maxAge: 60000 * 60 * 24 * 7 });

                return res.status(200).json({
                    error: false,
                    refreshUser: true,
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
            }
        })
    }
    // console.log(flag)
}