import pup from 'puppeteer-core'
import setPageSettings from './setPageSettings'
const executablePath = `C:/Program Files/Google/Chrome/Application/chrome.exe`


interface PupProps {
  width?: number; height?: number;
}

const connToPuppeteer = async ({width, height}: PupProps) => {
  
  const browser = await pup.launch({
      headless: process.env.DEV ? false : 'shell',
      executablePath: executablePath,
      defaultViewport: { width: width || 1536, height: height || 800 },
      // devtools: process.env.DEV ? true : false,
      // args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security',],
  })
  console.log('Browser opened')
  
  const page = await browser.newPage()

  await setPageSettings({page, showMedia: false})
  
  return {
      browser,
      page,
      
  }
}


export default connToPuppeteer