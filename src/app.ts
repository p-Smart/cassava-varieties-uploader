require('dotenv').config()
import express from 'express'
const app = express()
import path from 'path'
import routes from './routes'
import cookieParser from 'cookie-parser'
import NotFound from './routes/404'
import NodeCache from 'node-cache'
import clientLog from './utils/clientLog'

export const appCache = new NodeCache()

const originalConsoleLog = console.log;
console.log = (...args: unknown[]) => {
    const argWCacheIdIndex = args.findIndex( (arg) => Boolean((arg as any)?.cacheId ) )
    if(argWCacheIdIndex !== -1){
      const argWCacheId = args[argWCacheIdIndex]
      args.splice(argWCacheIdIndex, 1)
      
      clientLog.set((argWCacheId as any)?.cacheId, args.map(arg => String(arg)).join(' '))
    }

    originalConsoleLog(...args)
}

const appRoot = path.resolve(__dirname)
app.use(cookieParser())
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({extended: false}))
app.use('/client', (req, res, next) => {
  next();
}, express.static(path.join(appRoot, '/client')));


app.use('', routes)







const startServer = async () => {
  try{
    app.listen(process.env.PORT || 8008, () => console.log(`Server running...`, {cacheId: 10111}))
  }
  catch(err){
    console.log(err.message)
  }
}

startServer()




app.use(NotFound)