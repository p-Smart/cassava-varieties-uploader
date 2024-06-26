import { validationResult } from "express-validator"
import withErrorHandler from "../errorHandler"
import error from "../../exceptions/throwError"
import connToPuppeteer from "../../config/puppeteer/pupConnect"
import uploadVarietyAxios from "../../components/withAxios/uploadVariety"
import uploadVarietyPup from "../../components/withPuppeteer/uploadVariety"
import loginAxios from "../../components/withAxios/login"
import loginPup from "../../components/withPuppeteer/login"
import { IVariety } from "../../components/types"
import withPup from "../../config/puppeteer/withPup"


const UploadCassavaVarieties = withErrorHandler(async (req, res) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
        error(result.array()[0].msg, 400)
    }

    const dto = req.body
    const mode = dto.mode
    const visible = mode==='visible'
    
    if(!visible){
        const loginCookies = await loginAxios({
            url: 'https://seedtracker.org/newcassava',
            username: dto.username,
            password: dto.password,
            req
        })
        
        await Promise.all( dto.data.map( (variety: IVariety) => uploadVarietyAxios({loginCookies, variety, req}) ) )
    }
    else{
        await withPup( async ({browser, page}) => {
            await loginPup({
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
        } )
    }
    
    return {
        message: 'All varieties uploaded'
    }
})


export default UploadCassavaVarieties