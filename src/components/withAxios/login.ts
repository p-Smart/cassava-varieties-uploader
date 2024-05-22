import axios from "axios"
import error from "../../exceptions/throwError"
import cookieArrToString from "../../utils/cookieArrToString"
import { genRandomHeader } from "../../utils/random"
import { Request } from "express"

axios.defaults.headers.common = {...axios.defaults.headers.common, ...genRandomHeader()}

interface ILoginAxios {
    url: string;
    username: string;
    password: string;

    req: Request;
}

const loginAxios = async ({
    url,
    username,
    password,
    

    req,
}: ILoginAxios) => {

    // Set wordpress cookies
    const {headers: initialLoadHeaders} = await axios.get(`${url}/wp-login.php`)
    
    const loginData = new FormData()
    loginData.append('log', username)
    loginData.append('pwd', password)
    loginData.append('rememberme', 'forever')
    loginData.append('wp-submit', 'Log In')
    loginData.append('redirect_to', `${url}/wp-admin/`)
    loginData.append('testcookie', '1')

    const {headers: loginHeaders} = await axios.post(`${url}/wp-login.php`, loginData, {
        headers: {
            Cookies: cookieArrToString(initialLoadHeaders['set-cookie'])
        }
    })
    
    const cookies = loginHeaders['set-cookie']

    const isLoggedIn = cookies && cookies.some(cookie => {
        const realCookie = decodeURIComponent(cookie)
        const cookieVal = ((realCookie.split('='))[1].split(';'))[0]
        return realCookie.startsWith('wordpress_logged_in') && cookieVal.length > 10
    });
    

    if(!isLoggedIn){
        error('Wordpress login failed')
    }

    const msg1 = `${username} logged in.`
    console.log(msg1, {cacheId: req.body.reqId})
    return cookieArrToString(cookies)
}


export default loginAxios