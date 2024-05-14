const pup = require('puppeteer-core')
const setPageSettings = require('../components/setPageSettings')
// const executablePath = `C:/Users/Prince/.cache/puppeteer/chrome/win64-113.0.5672.63/chrome-win64/chrome.exe`
const executablePath = `C:/Program Files/Google/Chrome/Application/chrome.exe`


const connToPuppeteer = async (width, height, showMedia) => {
  var browser
  browser = await pup.launch({
      headless: process.env.DEV ? false : 'new',
      executablePath: executablePath,
      defaultViewport: { width: width || 1536, height: height || 800 },
      // devtools: process.env.DEV ? true : false,
      // args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security',],
  })
  console.log('Browser opened')
  
  const page = await browser.newPage()

  await setPageSettings(page, false)
  
  return {
      browser,
      page,
      
  }
}


module.exports = connToPuppeteer