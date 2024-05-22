import express from 'express'
import multer from 'multer'
const storage = multer.memoryStorage()
const upload = multer({storage})


import UploadCassavaVarietiesDto from './UploadCassavaVarieties/dto'
import UploadCassavaVarieties from './UploadCassavaVarieties'
import FetchLogs from './FetchLogs'
import UploadProdData from './UploadProdData'
import UploadProdDataDto from './UploadProdData/dto'

const router = express.Router()


router.post('/upload-cassava-varieties', upload.single('file'), UploadCassavaVarietiesDto, UploadCassavaVarieties)

router.post('/upload-prod-data', upload.single('file'), UploadProdDataDto, UploadProdData)

router.get('/logs/:id', FetchLogs)


router.get('/test', async (req, res) => {
    try{
  
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