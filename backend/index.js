//-------------- PACKAGES----------

import path from "path";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";

// ----------Utilities-----------
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

dotenv.config();
const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);

app.listen(port, () => console.log(`Server running on port : ${port}`));
