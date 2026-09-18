import mongoose from "mongoose";
import config from "../config/config.js";

const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGO_URL, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 30000,
            heartbeatFrequencyMS: 10000,
            family: 4,
            maxPoolSize: 25,
            bufferCommands: false,
        })
        console.log("mongoDB connected")
    } catch (error) {
        console.log("Error at ConnectDB", error)
        throw error
    }
}

mongoose.connection.on("error", (err) => console.error("MongoDB connection error:", err));
mongoose.connection.on("disconnected", () => console.warn("MongoDB disconnected"));
mongoose.connection.on("reconnected", () => console.log("MongoDB reconnected"));

export default connectDB