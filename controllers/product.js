import YelpProduct from "../models/products.js"
import multer from "multer";

export const getAllProduct = async (req, res) => {
    // creating post
    YelpProduct.find({}, async function(err, products) {
        if(err) {
            return res.status(400).json({
                error: true,
                message: "Internal server error"
            })
        }

        return res.status(200).json({
            error: false,
            products: products
        })
    });
}

export const createProduct = async (req, res) => {
    let inputImage = (req.file) ? req.file.filename : null;

    // playload for saving the data
    const productPayload = {
        productName: req.body.productName,
        productDes: req.body.productDes,
        price: req.body.price,
        productImage: inputImage,
        creatorId: req.body._id
    }


    // try catch the save function
    try {
        console.log("payload: ", productPayload)
        const newProduct = new YelpProduct(productPayload);
        console.log(newProduct)
        // save the product
        await newProduct.save().then(product => {
            return res.status(200).json({
                error: false,
                message: "product saved successfully",
                product: product
            })
        }).catch(err => {
            return res.status(401).json({
                error: true,
                message: "Some error occured",
                errorMessage: err
            })
        })
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal server error",
            errorMessage: error
        })
    }
}

export const deleteProdut = async (req, res) => {
    // get the product id
    const delete_productId = req.params.productId;

    let product_creator_flag = null;

    console.log("Req data: ", req.body)

    // check if the product belongs to the end user
    YelpProduct.findOne({_id: delete_productId}, async function(err, product) {
        if(err) {
            return res.status(400).json({
                error: true,
                message: "Internal server error"
            })
        }
        const creator_id = product.creatorId.toString();

        console.log("ID is: ", req.body._id)

        if(req.body._id === creator_id) {
            product_creator_flag = true
        } else {
            product_creator_flag = false
        }

        YelpProduct.deleteOne({ _id: delete_productId }, async function(err, dele_product) {
            if(err) {
                return req.status(400).json({
                    error: true,
                    message: "Couldn't delete the product from DB!"
                })
            }
        });

    });


    console.log("The status is: ", product_creator_flag)

    if(product_creator_flag === req.body._id) {
        console.log("This is the right creator of the product!");
    };

    res.status(200).json({
        message: "check console"
    })
}