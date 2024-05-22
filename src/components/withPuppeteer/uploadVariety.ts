import { Page } from "puppeteer-core"
import { IVariety } from "../types";
import { Request } from "express";


interface IUploadVarietyPup {
  page: Page;
  variety: IVariety;
  count?: number;

  req: Request;
}

const uploadVarietyPup = async ({
    page,
    variety,
    count,

    req,
}: IUploadVarietyPup) => {
    await page.goto('https://seedtracker.org/newcassava/wp-admin/post-new.php?post_type=variety')

    await Promise.race([
      page.waitForFunction( () => document.getElementById('post_wpcfvariety-name') !== null ),

      Promise.all([
        page.waitForFunction( () => window.location.href.includes('/newcassava/wp-admin/post-new')),
        page.waitForNavigation(),
      ])
    ])
    

    await page.evaluate((title, ogname, year, traits, details) => {
      const titleInput = document.getElementById('title')
      const vNameInput = document.getElementById('post_wpcfvariety-name')
      const ognameInput = document.getElementById('post_wpcforiginal-name')
      const yearInput = document.getElementById('post_wpcfyear-of-release')
      const traitsInput = document.getElementById('post_wpcffeatured-traits')
      const detailsInput = document.getElementById('post_wpcfmore-details')
    
      titleInput['value'] = title;
      titleInput.dispatchEvent(new Event('input', { bubbles: true }));

      document.getElementById('wpcf-fields-checkboxes-option-b1bc328ce47333eadb2434d8e0f12c6c-1').click();

      vNameInput['value'] = title;
      vNameInput.dispatchEvent(new Event('input', { bubbles: true }));

      ognameInput['value'] = ogname;
      ognameInput.dispatchEvent(new Event('input', { bubbles: true }));

      yearInput['value'] = year;
      yearInput.dispatchEvent(new Event('input', { bubbles: true }));

      traitsInput['value'] = traits;
      traitsInput.dispatchEvent(new Event('input', { bubbles: true }));

      detailsInput['value'] = !details ? '' : `<a href="${details}" target="_blank" rel="noopener">More details</a>`;
      detailsInput.dispatchEvent(new Event('input', { bubbles: true }));

      const traitsArr = traits.split(/,\s*|\s+and\s+/).map(text => text.toLowerCase().trim())

      Array.from(document.querySelectorAll('#traitchecklist li')).map( (el: any) => {
        const traitFrmCheckbox = el.innerText.toLowerCase().trim()
        const isTrait = traitsArr.some( (trait) => traitFrmCheckbox.includes( trait.slice(0,8) ) )
        isTrait && el.querySelector('input').click()
      } )

      let publishButton = document.getElementById(`publish`)
      publishButton.click()

  }, variety['Variety Name'], variety['Original Name'], variety['Year of Release'], variety['Featured traits'], variety['More details'])
    

  // await page.waitForNavigation()

  console.log(`${count || 0}. Uploaded ${variety['Original Name']}`, {cacheId: req.body.reqId})
}


export default uploadVarietyPup
