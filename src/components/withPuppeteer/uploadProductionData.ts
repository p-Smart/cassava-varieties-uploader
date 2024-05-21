import { Page } from "puppeteer-core"
import { IProductionData } from "../types";


interface IUploadProductionData {
  page: Page;
  data: IProductionData,
  count?: number;
}

const uploadProductionData = async ({
    page,
    data,
    count,
}: IUploadProductionData) => {
    await page.goto('https://seedtracker.org/cassava/wp-admin/post-new.php?post_type=production-field')
    
    const field = data

    await page.evaluate(({
        title,
        prodName,
        org,
        address,
        location,
        variery,
        varietyDetail,
        seedType,
        fieldSize,
        prodYear,
        prodPhone,
        prodEmail,
    }) => {
      const titleInput = document.getElementById('title')
      const prodnameInput = document.getElementById('post_wpcfname-of-producer')
      const orgInput = document.getElementById('post_wpcforganization')
      const addressInput = document.getElementById('post_wpcfaddress-of-field')
      const locationInput = document.getElementById('post_wpcflocation')
      const varieryInput = document.getElementById('post_wpcfvariety-planted')
      const varietyDetailInput = document.getElementById('post_wpcfvariety2')
      const seedTypeInput = document.getElementById('post_wpcftype-of-seed')
      const fieldSizeInput = document.getElementById('post_wpcfsize-of-field')
      const prodYearInput = document.getElementById('post_wpcfproduction-year')
      const prodPhoneInput = document.getElementById('post_wpcfproducer-phone')
      const prodEmailInput = document.getElementById('post_wpcfproducer-email-address')

    
      titleInput['value'] = title;
      titleInput.dispatchEvent(new Event('input', { bubbles: true }));

      document.getElementById('post_wpcftrackercountry_Nigeria').click()

      prodnameInput['value'] = prodName;
      prodnameInput.dispatchEvent(new Event('input', { bubbles: true }));

      orgInput['value'] = org;
      orgInput.dispatchEvent(new Event('input', { bubbles: true }));

      addressInput['value'] = address;
      addressInput.dispatchEvent(new Event('input', { bubbles: true }));

      locationInput['value'] = location;
      locationInput.dispatchEvent(new Event('input', { bubbles: true }));

      varieryInput['value'] = variery;
      varieryInput.dispatchEvent(new Event('input', { bubbles: true }));

      varietyDetailInput['value'] = varietyDetail;
      varietyDetailInput.dispatchEvent(new Event('input', { bubbles: true }));

      seedTypeInput['value'] = seedType;
      seedTypeInput.dispatchEvent(new Event('input', { bubbles: true }));

      fieldSizeInput['value'] = fieldSize;
      fieldSizeInput.dispatchEvent(new Event('input', { bubbles: true }));

      prodYearInput['value'] = prodYear;
      prodYearInput.dispatchEvent(new Event('input', { bubbles: true }));

      prodPhoneInput['value'] = prodPhone;
      prodPhoneInput.dispatchEvent(new Event('input', { bubbles: true }));

      prodEmailInput['value'] = prodEmail;
      prodEmailInput.dispatchEvent(new Event('input', { bubbles: true }));


      let publishButton = document.getElementById(`publish`)
      publishButton.click()

    }, 
    {
      title: field['Title'],
      prodName: field['Name'],
      org: field['Organization'],
      address: field['Address'],
      location: field['Location'],
      variery: field['Variety'],
      varietyDetail: field["Variety Details"],
      seedType: field["Type of Seed"],
      fieldSize: field["Size of Field"],
      prodYear: field["Production Year"],
      prodPhone: field['Phone'],
      prodEmail: field['Email'],
    })
    

  await page.waitForNavigation()

  console.log(`${count || 0}. Uploaded ${field.Title}`)
}


export default uploadProductionData
