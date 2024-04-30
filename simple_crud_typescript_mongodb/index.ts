import express, { Request, Response } from "express";
import mongoose, { Document } from "mongoose";
import bodyParser from "body-parser";

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Mongoose User Schema
interface User extends Document {
    name: string;
    email: string;
}

const userSchema = new mongoose.Schema<User>({
    name: { type: String, },
    email: { type: String, }
});

const UserModel = mongoose.model<User>("User", userSchema);

// CORS middleware
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    next();
});

// Define route handlers
// Create a user
app.post("/", async (req: Request, res: Response) => {
    try {
        const newUser = await UserModel.create(req.body);
        res.status(201).json(newUser);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

// Get all users
app.get("/api/users", async (req: Request, res: Response) => {
    try {
        const users = await UserModel.find();
        res.json(users);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Update a user
app.patch("/api/users/:id", async (req: Request, res: Response) => {
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(updatedUser);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a user
app.delete("/api/users/:id", async (req: Request, res: Response) => {
    try {
        const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

// Connect to MongoDB
const MONGO_URL = "mongodb+srv://vsidea2code:aDFTML4CCLMMgo3A@cluster01.cdgjr5r.mongodb.net/typescript-demo?retryWrites=true&w=majority";
mongoose.connect(MONGO_URL, {
    dbName: "typescript-demo",
    // useNewUrlParser:true,
    // useUnifiedTopology: true
})
    .then(() => console.log("Connected to MongoDB successfully"))
    .catch((err) => console.log("Error connecting to MongoDB:", err));

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});


// token base code:======================

// import express, { Request, Response } from "express";
// import mongoose, { Document } from "mongoose";
// import bodyParser from "body-parser";
// import jwt from "jsonwebtoken";

// const app = express();
// app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// // Mongoose User Schema
// interface User extends Document {
//     name: string;
//     email: string;
// }

// const userSchema = new mongoose.Schema<User>({
//     name: { type: String, },
//     email: { type: String, }
// });

// const UserModel = mongoose.model<User>("User", userSchema);

// // CORS middleware
// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader(
//         "Access-Control-Allow-Headers",
//         "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//     );
//     res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
//     next();
// });

// // Generate JWT token
// function generateToken(user: User) {
//     const payload = {
//         userId: user._id,
//         email: user.email
//     };
//     return jwt.sign(payload, "your_secret_key", { expiresIn: "1h" }); // Change "your_secret_key" to your actual secret key
// }

// // Token authentication middleware
// const authenticateToken = (req: Request, res: Response, next: Function) => {
//     const token = req.headers.authorization?.split(" ")[1];
//     if (!token) return res.status(401).json({ message: "Unauthorized" });

//     try {
//         const decodedToken = jwt.verify(token, "your_secret_key"); // Change "your_secret_key" to your actual secret key
//         req.userData = decodedToken;
//         next();
//     } catch (error) {
//         return res.status(401).json({ message: "Unauthorized" });
//     }
// };

// // Define route handlers
// // Create a user with token authentication
// app.post("/", async (req: Request, res: Response) => {
//     try {
//         const newUser = await UserModel.create(req.body);
//         const token = generateToken(newUser);
//         res.status(201).json({ newUser, token });
//     } catch (error: any) {
//         res.status(400).json({ message: error.message });
//     }
// });

// // Get all users with token authentication
// app.get("/api/users", authenticateToken, async (req: Request, res: Response) => {
//     try {
//         const users = await UserModel.find();
//         res.json(users);
//     } catch (error: any) {
//         res.status(500).json({ message: error.message });
//     }
// });

// // Update a user with token authentication
// app.patch("/api/users/:id", authenticateToken, async (req: Request, res: Response) => {
//     try {
//         const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         if (!updatedUser) {
//             return res.status(404).json({ message: "User not found" });
//         }
//         res.json(updatedUser);
//     } catch (error: any) {
//         res.status(400).json({ message: error.message });
//     }
// });

// // Delete a user with token authentication
// app.delete("/api/users/:id", authenticateToken, async (req: Request, res: Response) => {
//     try {
//         const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
//         if (!deletedUser) {
//             return res.status(404).json({ message: "User not found" });
//         }
//         res.json({ message: "User deleted successfully" });
//     } catch (error: any) {
//         res.status(400).json({ message: error.message });
//     }
// });

// // Connect to MongoDB
// const MONGO_URL = "your_mongodb_connection_string";
// mongoose.connect(MONGO_URL, {
//     dbName: "typescript-demo",
//     // useNewUrlParser:true,
//     // useUnifiedTopology: true
// })
//     .then(() => console.log("Connected to MongoDB successfully"))
//     .catch((err) => console.log("Error connecting to MongoDB:", err));

// // Start the server
// const PORT = 5000;
// app.listen(PORT, () => {
//     console.log(`Server is running at http://localhost:${PORT}`);
// });
