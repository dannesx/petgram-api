import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { UserRouter, PostRouter, CommentRouter } from './routes/index.ts'
import { errorHandler } from './middlewares/errorHandler.ts'

dotenv.config()

const app = express()
const port = process.env.PORT || 3333

app.use(express.json())

app.use(
	cors({
		origin: 'http://localhost:5173',
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	})
)

// Rotas
app.use('/users', UserRouter)
app.use('/posts', PostRouter)
app.use('/comments', CommentRouter)
app.get('/', (_, res) => res.status(200).json({ message: 'Hello World!' }))

// Middlewares
app.use(errorHandler)

app.listen(port, () => console.log(`HTTP Server at ${port}`))
