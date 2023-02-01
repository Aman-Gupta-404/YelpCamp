// getting all the modules
import express from 'express';
const app = express();
import cors from "cors";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from "path";
import { fileURLToPath } from 'url';

const PORT = process.env.PORT || 8080;
dotenv.config();

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

// getting all the routes
import userRoutes from "./Routes/user.js";
import productRoutes from "./Routes/products.js";
import authRoutes from "./Routes/auth.js";

// mongodb uri
// const mongoDb_URL = "mongodb+srv://Aman_Gupta:Aman2001@cluster0.uluvlcy.mongodb.net/?retryWrites=true&w=majority"
// const mongoDb_URL_new = "mongodb+srv://Aman_Gupta:Aman2001@cluster0.uluvlcy.mongodb.net/?retryWrites=true&w=majority"

// using middlewares
app.use('/Images', express.static('Images'));
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cookieParser());
app.use(cors({origin: true, credentials: true}));
// app.use(expressValidator());

// mongoDB URI environmental variables
const MogoDB_URI = process.env.MONGODBURL;

// adding the routes here
app.use("/api/user", userRoutes)
app.use("/api/product", productRoutes)
app.use("/api/auth", authRoutes)

mongoose.set("strictQuery", true);

// code for serving the frontend
app.use(express.static(path.join(__dirname, './client/build')));

app.get('*', function(req, res) {
    res.sendFile(
        path.join(__dirname, './client/build/index.html'),
        function(err) {
            res.status(500).send(err)
        }
    );
})


// connecting database and starting the server
mongoose.connect(MogoDB_URI, { useNewURLParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`DB connected and The server is running on port ${PORT}`)))
    .then(err => console.log("Error is: ", err));
