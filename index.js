import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import { getMe, login, register } from './logic/auth.js'
import { checkAuth } from './extencions/checkAuth.js'
import { upload } from './extencions/multerConfig.js'
import { addItem, deleteItem, getAll, getOne } from './logic/item.js'
import { adminOnly } from './extencions/adminOnly.js'
import { createCheckoutSession } from './extencions/stripe.js'
import { tgsent } from './extencions/telegram.js'

const app = express()
dotenv.config()
app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))

//Constants
const PORT = process.env.PORT || 5000;
const DB_NAME = process.env.DB_NAME
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD

//API
app.post('/api/auth/register', register)
app.post('/api/auth/login', login)
app.get('/api/auth/me',checkAuth, getMe)

app.get('/api/items', getAll)
app.get('/api/:id', checkAuth, getOne)
app.delete('/api/delete/:id', checkAuth, deleteItem)
app.post('/api/upload', checkAuth, adminOnly, upload.array('images', 5), addItem)
app.post('/api/create-checkout-session', createCheckoutSession)
app.use('/api/telegram', tgsent)


async function start() {
  try {
    await mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.u5sgw90.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`);
    app.listen(PORT, () => console.log(`Started on PORT:`, PORT));
  } catch (err) {
    console.log(err);
    }
  }
start();
