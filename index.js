import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import expressOasGenerator from "@mickeymond/express-oas-generator";
import session from "express-session";
import MongoStore from "connect-mongo";
import { restartServer } from "./restart_server.js";
import errorHandler from "errorhandler";
import { userRouter } from "./routes/userroute.js";
import adminRouter from "./routes/admin.js";
import { productRouter } from "./routes/products.js";

const app = express();

expressOasGenerator.handleResponses(app, {
    alwaysServeDocs: true,
    tags: [ 'users', 'products'
        // 'auth', 'userProfile', 'skills', 'projects', 'volunteering', 'experiences', 'education', 'achievements'
    ],
    mongooseModels: mongoose.modelNames(),
});

app.post('/send-email', async (req, res) => {
    const { to, subject, text, html } = req.body;
    try {
        await sendMail(to, subject, text, html);
        res.status(200).send('Email sent successfully');
    } catch (error) {
        res.status(500).send('Error sending email');
    }
})

// Apply middlewares
app.use(express.json());
// app.use(cors({
//     credentials: true,
//     origin: process.env.ALLOWED_DOMAINS?.split(',') || []
// }));
app.use(cors({ credentials: true, origin: '*' }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true }
    // Store session
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
expressOasGenerator.handleRequests();
// Swagger UI should be served last to avoid conflicts with API routes
app.use((req, res) => res.redirect('/api-docs/'));
app.use(errorHandler({ log: false }));

// Connect to database
await mongoose.connect(process.env.MONGO_URL);
console.log('Database is connected');

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
