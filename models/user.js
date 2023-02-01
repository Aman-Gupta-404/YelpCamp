import mongoose from "mongoose";
import bcrypt from "bcrypt";

const saltRounds = 10;

const YelpUserSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    wishList: [
        {
            type: mongoose.Types.ObjectId,
        }
    ],
    cart: [
        {
            type: mongoose.Types.ObjectId,
        }
    ],
    isSeller: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true
    },
})

// Pre function which is run before the schema model is saved in DB
YelpUserSchema.pre("save", async function(next) {
    if(this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, saltRounds)
    }
})

const YelpUser = mongoose.model("YelpUser", YelpUserSchema);

export default YelpUser;