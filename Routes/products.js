import express from "express"
import { getAllProduct, createProduct, deleteProdut } from "../controllers/product.js";
import { isLoggedin, isAuthorized } from "../controllers/auth.js"
import multer from "multer";

const router = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Images');
        // cb(null, path.join(__dirname + '/Images/'));
    },
    filename: (req, file, cb) => {
        let editedFileName = file.originalname.replace(/ /g, '');

        cb(null, Date.now() + '_' + editedFileName)
    }
})


const upload = multer({storage: storage})

// get all products
router.get("/get/all", getAllProduct);

// create products
router.post("/create", upload.single('productImage'), isLoggedin, isAuthorized, createProduct);

// create products
router.delete("/delete/:productId", isLoggedin, isAuthorized, deleteProdut);


export default router;
