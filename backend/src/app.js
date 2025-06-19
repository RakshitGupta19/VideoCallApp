import express from 'express';
import { createServer } from 'node:http';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv'; // 👈 Import dotenv
import userRoutes from "./routes/users.routes.js";
import { connectToSocket } from './controllers/socketManager.js';

dotenv.config(); // 👈 Load environment variables

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

// Use PORT from env or fallback to 8000
app.set("port", process.env.PORT || 8000);

// Middleware
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ extended: true, limit: "40kb" }));

// Routes
app.use("/api/v1/users", userRoutes);

app.get("/home", (req, res) => {
  return res.json({ hello: "World" });
});

const start = async () => {
  try {
    const connectionDB = await mongoose.connect(process.env.MONGO_URI); // 👈 Use env variable
    console.log(`MongoDB Connected: ${connectionDB.connection.host}`);

    server.listen(app.get("port"), () => {
      console.log(`Server running on port ${app.get("port")}`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
};

start();
