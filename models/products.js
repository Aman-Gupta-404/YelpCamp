import mongoose, { Schema } from "mongoose";

const YelpProductSchema = mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    productImage: {
        type: String,
        required: true
    },
    creatorId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    productDes: {
        type: String,
        required: true
    },
    price: Number,
    // likes: [
    //     {
    //         type: Schema.Types.ObjectId
    //     }
    // ],
})

const YelpProduct = mongoose.model("YelpProduct", YelpProductSchema);

export default YelpProduct;