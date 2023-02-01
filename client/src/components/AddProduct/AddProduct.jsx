import React, { useState, useEffect } from 'react';
import "./AddProduct.css";
import { useSelector } from 'react-redux';
import ClearIcon from '@mui/icons-material/Clear';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import axios from "axios";

function AddProduct({ toggleDialouge }) {
    const ReducerUser = useSelector((state) => state.userReducer.user);

    const [productData, setProductData] = useState({
        productName: "",
        productImage: "",
        productDes: "",
        price: "",
    });

    const [submissionError, setSubmissionError] = useState({
        error: false,
        message: ""
    })
    const [productAddSuccess, setProductAddSuccess] = useState(false);

    const [productNameError, setProductNameError] = useState({
        error: false,
        message: "",
    })
    const [productImageError, setProductImageError] = useState({
        error: false,
        message: "",
    })
    const [productDesError, setProductDesError] = useState({
        error: false,
        message: "",
    })
    const [priceError, setPriceError] = useState({
        error: false,
        message: "",
    })

    const [loading, setLoading] = useState(false);

    // Input error handelling
    const validaeInputs = (data) => {
        let errorFlag = false;
        // check if all input fieldsis filled
        if (data.productName === "" || data.productDes === "" || data.price === "" || data.productImage === "") {


            if (data.productDes === "") {
                setProductDesError({
                    ...productDesError,
                    error: true,
                    message: "Please fill this field"
                })
            }

            if (data.price === "") {
                setPriceError({
                    ...priceError,
                    error: true,
                    message: "Please fill this field"
                })
            }

            if (data.productImage === "") {
                setProductImageError({
                    ...productImageError,
                    error: true,
                    message: "Please add product image"
                })
            }


            if (data.productName === "") {
                setProductNameError({
                    ...productNameError,
                    error: true,
                    message: "Please fill this field"
                })
            }

            errorFlag = true;
        }


        // product name check         
        if (data.productName.length < 3) {
            setProductNameError({
                ...productNameError,
                error: true,
                message: "Product name should be more than 2 characters"
            })
            errorFlag = true;
        }

        // product price check
        if (parseInt(data.price) <= 0) {
            setPriceError({
                ...priceError,
                error: true,
                message: "Please enter a valid number"
            })
            errorFlag = true;
        }

        // product description check
        if (data.productDes.length < 3) {
            setProductDesError({
                ...productDesError,
                error: true,
                message: "Product description should be more than 2 characters"
            })
            errorFlag = true;
        }

        // return from the function
        return errorFlag;
    }

    const handleInputChange = (e) => {
        e.preventDefault();

        // set all the errors back to false
        setProductNameError({
            error: false,
            message: "",
        })
        setPriceError({
            error: false,
            message: "",
        })
        setProductDesError({
            error: false,
            message: "",
        })
        setProductImageError({
            error: false,
            message: "",
        })

        setProductData({
            ...productData,
            [e.target.name]: e.target.value
        })
    }

    const selectImageFile = (e) => {
        setProductData({ ...productData, productImage: e.target.files[0] })
    }

    // fuction to close the dialouge
    const closeDialouge = (e) => {
        // e.preventDefault();
        toggleDialouge()
    }

    // function to add the product
    const handleAddProduct = async (e) => {
        e.preventDefault();
        setLoading(true);
        // run validation check for all the inputs
        const returnFlag = await validaeInputs(productData)


        if (!returnFlag) {
            // here all the inputs dont have error
            const payloadData = {
                productName: productData.productName,
                productDes: productData.productDes,
                productImage: productData.productImage,
                price: parseInt(productData.price)
            };

            try {
                // append all the data in form data
                const formData = new FormData()
                formData.append("productImage", productData.productImage, productData.productImage.name);
                formData.append("productName", productData.productName);
                formData.append("productDes", productData.productDes);
                formData.append("price", parseInt(productData.price));
                formData.append("_id", ReducerUser._id);

                // defining headers for the request
                const headers = {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${ReducerUser.accessToken}`
                }

                await axios.post(
                    `/api/product/create`,
                    formData,
                    { headers: headers }
                ).then(res => {
                    if(res.data.error) {
                        // code for errror in the request data
                        setLoading(false);
                        return setSubmissionError({
                            error: true,
                            message: res.data.message
                        });
                    } else {
                        // Producted posted successfully

                        setProductData({
                            productName: "",
                            productImage: "",
                            productDes: "",
                            price: "",
                        })
                        setSubmissionError({
                            error: false,
                            message: ""
                        });
                        setLoading(false);
                        return setProductAddSuccess(true);
                    }
                });
                
            } catch (error) {
                setLoading(false);
                return setSubmissionError({
                    error: true,
                    message: error
                });
            };
        } else {
            setLoading(false);
            return setSubmissionError({
                error: true,
                message: "Product not added!"
            });
        }

    }

    const closeErrorPopup = (e) => {
        e.preventDefault();
        setSubmissionError(false);
    }

    const closeSuccessPopup = (e) => {
        e.preventDefault();
        setProductAddSuccess(false);
    }

    const errorMessage = () => {
        return (
            <div className='appProduct__popup_container--error'>
                <p className="text_para">
                    Couldn't add produt, please try again
                </p>
                <ClearIcon onClick={closeErrorPopup} className='dialougeIcons-error'/>
            </div>
        )
    }

    const successMessage = () => {
        return (
            <div className='appProduct__popup_container--success'>
                <p className="text_para">
                    Product added successfully!
                </p>
                <ClearIcon onClick={closeSuccessPopup} className='dialougeIcons-success'/>
            </div>
        )
    }

    return (
        <>
            {submissionError.error ? errorMessage() : ""}
            {productAddSuccess ? successMessage() : ""}

            <DialogTitle id="alert-dialog-title">
                <p className='dialouge__heading'>Add Products</p>
            </DialogTitle>
            <DialogContent>
                {/* The form comes here */}
                <div className='addproduct'>
                    <div className="addproduct__horizontal">
                        <p className="addProduct--lable">Name</p>
                        <input type="text" name='productName' className="addProduct--input" onChange={handleInputChange} value={productData.productName} />
                        <p className="addproduct__error--text">{productNameError.message}</p>
                    </div>
                    <div className="addproduct__horizontal">
                        <p className="addProduct--lable">Price</p>
                        <input type="number" name='price' className="addProduct--input" onChange={handleInputChange} value={productData.price} />
                        <p className="addproduct__error--text">{priceError.message}</p>
                    </div>
                    <div className="addproduct__horizontal-des">
                        <p className="addProduct--lable">Description</p>
                        <textarea type="text" name='productDes' className="addProduct--input-des" onChange={handleInputChange} value={productData.productDes} />
                        <p className="addproduct__error--text">{productDesError.message}</p>
                    </div>
                    <div className="addproduct__horizontal">
                        <p className="addProduct--lable">Image</p>
                        <input type="file" className="addProduct--input--file" onChange={selectImageFile} />
                        <p className="addproduct__error--text">{productImageError.message}</p>
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <button onClick={loading? null : closeDialouge} className="account__action--button-cancel" id={loading ? 'addProduct__disable' : ""}>Cancel</button>
                <button onClick={loading? null : handleAddProduct} autoFocus className='account__action--button-add' id={loading ? 'addProduct__disable' : ""}>
                    Add
                </button>
            </DialogActions>
        </>

    )
}

export default AddProduct