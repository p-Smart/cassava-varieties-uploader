import { Page } from "puppeteer-core";

interface IClearCookies {
  page: Page
}

const clearCookies = async ({
    page,
}: IClearCookies) => {

    const cookies = await page.cookies();
    
    // Delete each cookie
    for (let cookie of cookies) {
      await page.deleteCookie(cookie);
    }
    console.log('Cookies cleared')
}

export default clearCookies