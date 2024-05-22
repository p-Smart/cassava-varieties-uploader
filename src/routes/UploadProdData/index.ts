import { validationResult } from "express-validator"
import withErrorHandler from "../errorHandler"
import error from "../../exceptions/throwError"
import connToPuppeteer from "../../config/puppeteer/pupConnect"
import uploadProdData from "../../components/withPuppeteer/uploadProdData"
import loginAxios from "../../components/withAxios/login"
import loginPup from "../../components/withPuppeteer/login"
import withPup from "../../config/puppeteer/withPup"


const UploadProdData = withErrorHandler(async (req, res) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
        error(result.array()[0].msg, 400)
    }

    const dto = req.body
    const mode = dto.mode
    const visible = mode==='visible'
    
    if(!visible){
        throw new Error('Invisible mode has not been implemented yet.')
        
        const loginCookies = await loginAxios({
            url: 'https://seedtracker.org/cassava',
            username: dto.username,
            password: dto.password,
            req
        })
    }
    else{
        await withPup( async ({browser, page}) => {
            await loginPup({
                page,
                url: 'https://seedtracker.org/cassava',
                username: dto.username,
                password: dto.password,
                req
            })
            let count = 0
            for (const prodData of dto.data){
                await uploadProdData({page, data: prodData, count, req})
                ++count
            }
        } )
    }
    
    return {
        message: 'All production data uploaded'
    }
})


export default UploadProdData