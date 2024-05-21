import { Request } from "express";
import { Page } from "puppeteer-core"


interface ILogin {
    page: Page;
    url: string;
    username: string;
    password: string;

    req: Request;
}

const login = async ({
    page,
    url,
    username,
    password,

    req
}: ILogin) => {

    await page.goto(`${url}/wp-login.php`)

    await page.evaluate((username, password) => {
        const usernameInput = document.getElementById('user_login')
        const passwordInput = document.getElementById('user_pass')
      
        usernameInput['value'] = username;
        usernameInput.dispatchEvent(new Event('input', { bubbles: true }));
  
        passwordInput['value'] = password;
        passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
  
        let loginButton = document.getElementById(`wp-submit`)
        loginButton.click()
  
    }, username, password)

    await page.waitForNavigation()

    if(page.url().includes('/wp-login.php')){
        throw new Error('Error logging in, check browser for more details.')
    }
    console.log('User logged in', {cacheId: req.body.reqId})
}


export default login