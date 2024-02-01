import express from "express";
import ViteExpress from "vite-express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv"
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/user.js"


/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
var corsOptions = {
  origin: 'http://127.0.0.1:*',
  optionsSuccessStatus: 200
}
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* ROUTES */
//app.post("/auth/register", register)
app.use("/auth", authRoutes)
app.use("/user", userRoutes)




/** MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
const uri = process.env.MONGO_URL;
const clientOptions = {
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true
  },
  authSource: "admin",
  ssl: true,
};

/** CORS CONFIG VIA HELMET */
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

/** CSP CONFIG VIA HELMET */
// app.use(helmet.contentSecurityPolicy({
//   directives: {
//     defaultSrc: ["self"],
//     scriptSrc: ["unsafe-inline"],
//     styleSrc: ["'self'", "unsafe-inline"],
//     imgSrc: ["'self'", "example.com"],
//     connectSrc: ["'self'"],
//     fontSrc: ["'self'"],
//     objectSrc: ["'none'"],
//     mediaSrc: ["'self'"]
//   }
// }));
// app.use(helmet({
//   contentSecurityPolicy: false,
// }));
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'unsafe-inline'", "localhost:*"],
      objectSrc: ["'none'"],
      connectSrc: ["'self'", "localhost:*", "http://127.0.0.1:*"],
      upgradeInsecureRequests: [],
    },
  })
);




/** STARTING THE SERVER */
async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    ViteExpress.listen(app, PORT, () => console.log(`SERVER PORT: ${PORT}`));
  } catch (error) {
    // Ensures that the client will close when you error
    console.log(error)
    await mongoose.disconnect();
  }
}
run().catch(console.dir);
