import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import "./ManageProducts.css"

function ManageProducts() {
    const token = useSelector((state) => state.userReducer.user.accessToken);
    const userId = useSelector((state) => state.userReducer.user._id);
    const dispatch = useDispatch();
    
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState({
        status: false,
        message: ""
    })
    const [errorMsg, setErrorMsg] = useState({
        status: false,
        message: ""
    })

    // populating the data from the database 
    useEffect(() => {
        populateProducts();
    }, [products.length, products, loading])
    
    const populateProducts = async () => {
        // making an api call to get all the data
        await axios.get("/api/product/get/all").then(res => {
            if (res.data.error) {
                // showing the error
                setErrorMsg({
                    status: true,
                    message: "Something went wrong, please try again!"
                })
                setInterval(() => {
                    setErrorMsg({
                        status: false,
                        message: ""
                    })  
                }, 3000);
                return
            }

            // populating the data to product state
            const tempData = res.data.products;
            const myProducts = tempData.filter(prod => {
                return prod.creatorId === userId;
            })
            setProducts([...myProducts]); 

            
        })

        // setting the loading to false
        setLoading(false)
    };

    const deleteProduct = (e) => {
        e.preventDefault();

        setLoading(true);

        // make api call to delete the product
        const delete_productId = e.target.name;

        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        console.log(config)
        const payload = {
            productId: delete_productId,
            _id: userId,
        }

        axios.delete(`/api/product/delete/${delete_productId}`,
            { data: payload, headers: { Authorization: `Bearer ${token}` } }).then(res => {
                if(res.data.error) {
                    setTimeout(() => {
                        setErrorMsg({
                            status: false,
                            message: res.data.message
                        })
                    }, 3000);
                    return;
                }
                
                // no error, remove the product from list and send a success message
                let tempNewProdArr = [...products];

                tempNewProdArr.filter(item => {
                    return item._id !== delete_productId;
                })

                setProducts([...tempNewProdArr]);
                setLoading(false);
                setTimeout(() => {
                    setSuccessMsg({
                        status: true,
                        message: "Product removed successfully!"
                    })    
                }, 3000);
            });
    }

    const successMessage = (e) => {
        return (
            <div className="managePage_success">
                <p className="manage_success_text">{successMsg.message}</p>
            </div>
        )
    }

    const errorMessage = (e) => {
        return (
            <div className="managePage_error">
                <p className="manage_error_text">{errorMsg.message}</p>
            </div>
        )
    };

  return (
    <div className='manage_page'>
        {successMsg.status? successMessage(): null}
        {errorMsg.status? errorMessage(): null}
        {products === 0 ? 
            null:
            <div className="manage_page_container" id={loading ? "managePageLoading" : null}>
                {products.map((item, index) => {
                    return (
                            <div className="manage_page_item_box" key={index}>
                                <div className="manage_page_item_box_left">
                                    <div className="manage_page_image_div">
                                        <img src={`/Images/${item.productImage}`} alt="" className='manage_page_image'/>
                                    </div>
                                    <div className="manage_page_name">
                                        <p className="manage_page_text">
                                            {item.productName}
                                        </p>
                                    </div>
                                </div>
                                <div className="manage_page_item_box_right">
                                    <div className="manage_page_removeButton">
                                        {/* <button className="manage_action_remove_button" name={item._id}>
                                            Remove
                                        </button> */}
                                    </div>
                                    <div className="manage_page_price">
                                        <button className="manage_action_add_button" name={item._id} onClick={deleteProduct}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                    )
                })}
                <div className="manage_page_item_box_total">
                    <div className="manage_page_item_box_total_left">
                        <p className="manage_page_text">Total</p>
                    </div>
                    <div className="manage_page_item_box_total_right">
                        <p className="manage_page_text">price</p>
                        {/* <button onClick={testFunction}>Check</button> */}
                    </div>
                </div>
            </div>
        }
    </div>
  )
}

export default ManageProducts