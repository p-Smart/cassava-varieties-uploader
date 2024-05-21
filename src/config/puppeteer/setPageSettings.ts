import { Page } from "puppeteer-core"


const defaultTimeout = 300000
interface ISetPageSetting {
    page: Page;
    showMedia?: boolean;
}
const setPageSettings = async ({
    page, showMedia,
}: ISetPageSetting) => {

    page.setDefaultTimeout(defaultTimeout)

    if(!showMedia){
        await page.setRequestInterception(true)

        page.on('request', (request) => {
            if (
            request.resourceType() === 'image' ||
            request.resourceType() === 'media'
            ) {
            request.abort();
            } else {
            request.continue();
            }
        })
    }
}

export default setPageSettings