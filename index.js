require('dotenv').config()
const express = require('express')
const app = express()
const connToPuppeteer = require('./config/pupConnect')
const uploadVariety = require('./components/uploadVariety')
const allVarieties = require('./oldCassavaVarieties')
const setPageSettings = require('./components/setPageSettings')
const login = require('./components/login')
const uploadProductionData = require('./components/uploadProductionData')
const productionData = require('./productionData')


app.use(express.urlencoded({ extended: true }))


app.get('/test', async (_, res) => {
  try{
    var {browser, page} = await connToPuppeteer()
    const username = 'higboko'
    const password = 'iita@2023'
    
    await login({page, username, password})

    let count = 10
    
    for (const data of productionData.slice(count)){
      await uploadProductionData({page, data, count})
      ++count
    }


    // for (const variety of allVarieties.slice(count)){
    //   const newPage = await browser.newPage()
    //   await setPageSettings(newPage, false)
    //   await uploadVariety({page: newPage, variety, count})
    //   await newPage.close()
    //   ++count;
    // }
    

    return res.json({
      success: true,
    })
  }
  catch(err){
    console.log(err.message)
  }
  finally{
    // await page?.close()
    // await browser?.close()
  }
})








app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})
  
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      error: {
        message: `You're lost, man!`
      }
    });
    next()
})



const listen = () => {
    app.listen(process.env.PORT || 8008, () => console.log(`Server running...`))
}

listen()

