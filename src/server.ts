import express, { Response } from 'express'
import {
	authRouter,
	commentRouter,
	likeRouter,
	postRouter,
	userRouter,
} from './routes'
import { errorHandler } from './middlewares/errorHandler'

const app = express()
const port = process.env.PORT || 3333

app.use(express.json())

app.use('/users', userRouter)
app.use('/posts', postRouter)
app.use('/comments', commentRouter)
app.use('/likes', likeRouter)
app.use('/auth', authRouter)

app.use(errorHandler)

app.listen(port, () => console.log(`Server running at PORT ${port}`))