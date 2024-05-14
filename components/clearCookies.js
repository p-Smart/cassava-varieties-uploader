

const clearCookies = async ({
    page,
}) => {

    const cookies = await page.cookies();
    
    // Delete each cookie
    for (let cookie of cookies) {
      await page.deleteCookie(cookie);
    }
    console.log('Cookies cleared')
}

module.exports = clearCookies