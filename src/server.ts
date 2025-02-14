import express from 'express';
import {
	authRouter,
	commentRouter,
	likeRouter,
	postRouter,
	userRouter,
} from './routes';
import { errorHandler } from './middlewares/errorHandler';
import cors from "cors"

const app = express();
const port = process.env.PORT || 3333;

// Middleware
app.use(express.json({ limit: "5mb" }));
app.use(cors({
	origin: "http://localhost:5173",
	allowedHeaders: ["Content-Type", "Authorization"],
	methods: ["GET", "POST", "PUT", "DELETE"]
}))

// Routes
app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/comments', commentRouter);
app.use('/auth', authRouter);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(port, () => console.log(`Server running at PORT ${port}`));
