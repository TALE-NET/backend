import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import expressOasGenerator from "@mickeymond/express-oas-generator";
import session from "express-session";
import MongoStore from "connect-mongo";
import { restartServer } from "./restart_server.js";
import errorHandler from "errorhandler";
import { userRouter } from "./routes/userroute.js";
import {adminRouter} from "./routes/admin.js";
import { productRouter } from "./routes/products.js";
import passport from 'passport';
import './config/passport.js'; 
import { companyRouter } from "./routes/company.js";
import { eventRouter } from "./routes/event.js";
import { galleryRouter } from "./routes/gallery.js";
import { userProfileRouter } from "./routes/profile.js";


const app = express();

// Connect to database
await mongoose.connect(process.env.MONGO_URL);
console.log('Database is connected');

expressOasGenerator.handleResponses(app, {
    alwaysServeDocs: true,
    tags: [ 'auth','users', 'product','profile', 'company', 'event', 'gallery'],
    mongooseModels: mongoose.modelNames(),
});


// Apply middlewares
// app.use(cors({
//     credentials: true,
//     origin: process.env.ALLOWED_DOMAINS?.split(',') || []
// }));

app.use(express.json());

app.use(cors({ credentials: true, origin: '*' }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL
    })
}));



// Health Check
app.get('/api/v1/health', (req, res) => {
    res.json({ status: 'UP' });
});

// Use routes with '/api' prefix
app.use(adminRouter);
app.use(userRouter);
app.use(productRouter);
app.use(companyRouter);
app.use(userProfileRouter);
app.use(eventRouter);
app.use(galleryRouter);
expressOasGenerator.handleRequests();
// Swagger UI should be served last to avoid conflicts with API routes
app.use((req, res) => res.redirect('/api-docs/'));
app.use(errorHandler({ log: false }));
app.use(passport.initialize());
app.use(passport.session());


// Listen for incoming requests
const port = process.env.PORT || 4600;
app.listen(port, () => {
    reboot().then(() => {
        console.log('Server restarted');
    });
    console.log(`App listening on port ${port}`);
});

const reboot = async () => {
    setInterval(restartServer, process.env.INTERVAL);
};
