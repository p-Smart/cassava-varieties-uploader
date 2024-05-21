import { validationResult } from "express-validator"
import withErrorHandler from "../errorHandler"
import error from "../../exceptions/throwError"
import uploadVariety from "../../components/withAxios/uploadVariety"
import loginToWordpressAdmin from "../../components/withAxios/loginToWordpressAdmin"


const UploadCassavaVarieties = withErrorHandler(async (req, res) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
        error(result.array()[0].msg, 400)
    }

    const dto = req.body

    const loginCookies = await loginToWordpressAdmin({
        url: 'https://seedtracker.org/newcassava',
        username: dto.username,
        password: dto.password
    })
  
    await Promise.all( dto.data.map( (variety) => uploadVariety({loginCookies, variety}) ) )
    
    return {
        message: 'All varieties uploaded'
    }
})


export default UploadCassavaVarieties