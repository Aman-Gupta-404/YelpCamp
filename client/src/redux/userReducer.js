import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isLoggedIn: false,
    user: {
        _id: "",
        firstName: "",
        lastName: "",
        email: "",
        accessToken: "",
        wishList: [],
        cart: [],
        isSeller: ""
    }
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginUser: (state, action) => {
            console.log("reaching here")
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state = {
                ...state,
                isLoggedIn: true,
                user: {
                    ...state.user,
                    _id: action.payload._id,
                    firstName: action.payload.firstName,
                    lastName: action.payload.lastName,
                    email: action.payload.email,
                    accessToken: action.payload.authToken,
                    wishList: action.payload.wishList ? action.payload.wishList : [],
                    cart: action.payload.cart ? action.payload.cart : []
                }
            }
            return state
        },
        updateUserReducer: (state, action) => {
            state = {
                ...state,
                user: {
                    ...state.user,
                    firstName: action.payload.firstName,
                    lastName: action.payload.lastName,
                }
            }
            return state
        },
        refreshUser: (state, action) => {
            state = {
                ...state,
                isLoggedIn: true,
                user: {
                    ...state.user,
                    _id: action.payload._id,
                    firstName: action.payload.firstName,
                    lastName: action.payload.lastName,
                    email: action.payload.email,
                    accessToken: action.payload.authToken,
                    wishList: action.payload.wishList ? action.payload.wishList : [],
                    cart: action.payload.cart ? action.payload.cart : []
                }
            }
            return state
        },
        addWishListItem: (state, action) => {
            state = {
                ...state,
                isLoggedIn: state.isLoggedIn,
                user: {
                    ...state.user,
                    wishList: [
                        ...action.payload.products
                    ]
                }
            }
            return state
        },
        removeWishListItem: (state, action) => {
            // TODO: still need to edit this function to remove from wishlist
            state = {
                ...state,
                isLoggedIn: state.isLoggedIn,
                user: {
                    ...state.user,
                    wishList: [
                        ...action.payload.products
                    ]
                }
            }
            return state
        },
        // TODO: action to add item to cart
        addCartItem: (state, action) => {
            state = {
                ...state,
                isLoggedIn: state.isLoggedIn,
                user: {
                    ...state.user,
                    cart: [
                        ...action.payload.products
                    ]
                }
            }
            return state
        },
        removeCartItem: (state, action) => {
            state = {
                ...state,
                isLoggedIn: state.isLoggedIn,
                user: {
                    ...state.user,
                    cart: [
                        ...action.payload.products
                    ]
                }
            }
            return state
        },
        logOutUser: (state) => {
            state = {
                ...state,
                isLoggedIn: false,
                user: {
                    ...state.user,
                    _id: "",
                    firstName: "",
                    lastName: "",
                    email: "",
                    accessToken: "",
                    wishList: [],
                    cart: [],
                    isSeller: ""
                }
            }
            return state
        },
    },
})

// Action creators are generated for each case reducer function
export const { loginUser, logOutUser, updateUserReducer, refreshUser, addWishListItem, removeWishListItem, addCartItem, removeCartItem } = userSlice.actions

export default userSlice.reducer