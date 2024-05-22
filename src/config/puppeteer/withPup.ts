import { Browser, Page } from "puppeteer-core";
import connToPuppeteer from "./pupConnect";


interface IWithPupHandler {
    browser: Browser;
    page: Page;
}
const withPup = async (handler: ({browser, page}: IWithPupHandler) => Promise<void>) => {
    try{
        var {browser, page} = await connToPuppeteer({})
        await handler({browser, page});
    }
    catch(err){
        throw err;
    }
    finally{
        if(!process.env.LEAVE_BROWSER_OPENED){
            if(page){
                await page.close();
            }
            if(browser){
                await browser.close();
            }
        }
    }
}


export default withPup