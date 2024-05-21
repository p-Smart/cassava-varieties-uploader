import axios from "axios"
import error from "../../exceptions/throwError"
import cookieArrToString from "../../utils/cookieArrToString"
import { genRandomHeader } from "../../utils/random"

axios.defaults.headers.common = {...axios.defaults.headers.common, ...genRandomHeader()}

interface ILogin {
    url: string;
    username: string;
    password: string;
}

const loginToWordpressAdmin = async ({
    url,
    username,
    password
}: ILogin) => {

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
    
    !isLoggedIn && error('Wordpress login failed')

    console.log(`${username} logged in.`)
    return cookieArrToString(cookies)
}


export default loginToWordpressAdmin