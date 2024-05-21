import { validationResult } from "express-validator"
import withErrorHandler from "../errorHandler"
import error from "../../exceptions/throwError"
import loginToWordpressAdmin from "../../components/withAxios/loginToWordpressAdmin"
import login from "../../components/withPuppeteer/login"
import connToPuppeteer from "../../config/puppeteer/pupConnect"
import uploadVarietyAxios from "../../components/withAxios/uploadVariety"
import uploadVarietyPup from "../../components/withPuppeteer/uploadVariety"


const UploadCassavaVarieties = withErrorHandler(async (req, res) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
        error(result.array()[0].msg, 400)
    }

    const dto = req.body
    const mode = dto.mode
    const visible = mode==='visible'
    
    if(!visible){
        const loginCookies = await loginToWordpressAdmin({
            url: 'https://seedtracker.org/newcassava',
            username: dto.username,
            password: dto.password,
            req
        })
        
        await Promise.all( dto.data.map( (variety) => uploadVarietyAxios({loginCookies, variety, req}) ) )
    }
    else{
        const {browser, page} = await connToPuppeteer({})
        await login({
            page,
            url: 'https://seedtracker.org/newcassava',
            username: dto.username,
            password: dto.password,
            req
        })
        let count = 0
        for (const variety of dto.data){
            await uploadVarietyPup({page, variety, count, req})
            ++count
        }
    }
    
    return {
        message: 'All varieties uploaded'
    }
})


export default UploadCassavaVarieties