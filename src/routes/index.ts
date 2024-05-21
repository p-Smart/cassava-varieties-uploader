import express from 'express'
import multer from 'multer'
const storage = multer.memoryStorage()
const upload = multer({storage})


import UploadCassavaVarietiesDto from './UploadCassavaVarieties/dto'
import UploadCassavaVarieties from './UploadCassavaVarieties'
import clientLog from '../utils/clientLog'
import FetchLogs from './FetchLogs'

const router = express.Router()


router.post('/upload-cassava-varieties', upload.single('file'), UploadCassavaVarietiesDto, UploadCassavaVarieties)

router.get('/logs/:id', FetchLogs)


router.get('/test', async (req, res) => {
    try{
      // const loginCookies = await loginToWordpressAdmin({
      //   url: 'https://seedtracker.org/newcassava',
      //   username: 'princeayokunle2002@gmail.com',
      //   password: 'PrAnnie_2018'
      // })
  
      // await uploadVariety({loginCookies})
      // var {browser, page} = await connToPuppeteer()
      // const username = 'higboko'
      // const password = 'iita@2023'
      
      // await login({page, username, password})
  
      // let count = 10
      
      // for (const data of productionData.slice(count)){
      //   await uploadProductionData({page, data, count})
      //   ++count
      // }
  
  
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
    catch(err: any){
      console.log(err.message)
      res.json({
        success: false,
        message: err.message
      })
    }
    finally{
      // await page?.close()
      // await browser?.close()
    }
})

export default router