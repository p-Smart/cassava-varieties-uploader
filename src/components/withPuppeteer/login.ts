import { Page } from "puppeteer-core"


interface ILogin {
    page: Page;
    username: string;
    password: String;
}

const login = async ({
    page,
    username,
    password
}: ILogin) => {

    await page.goto('https://seedtracker.org/cassava/wp-login.php')

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

    console.log('User logged in')
}


export default login