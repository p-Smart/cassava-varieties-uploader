require('dotenv').config()
import express from 'express'
const app = express()
import path from 'path'
import routes from './routes'
import cookieParser from 'cookie-parser'
import NotFound from './routes/404'

const appRoot = path.resolve(__dirname)
app.use(cookieParser())
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({extended: false}))
app.use('/client', (req, res, next) => {
  next();
}, express.static(path.join(appRoot, '/client')));


app.use('', routes)







const startServer = () => {
    app.listen(process.env.PORT || 8008, () => console.log(`Server running...`))
}

startServer()




app.use(NotFound)