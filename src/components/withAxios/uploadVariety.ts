import axios from "axios";
import { JSDOM } from "jsdom";
import cookieArrToString from "../../utils/cookieArrToString";
import { IVariety } from "../types";

interface IUploadVariety {
  loginCookies: string;
  variety: IVariety;
}
const uploadVariety = async ({
    loginCookies,
    variety,
}: IUploadVariety) => {
  if(!loginCookies){
    throw new Error('Login cookies need to be passed')
  }
  if(!variety){
    throw new Error('Variety is empty')
  }
  
  const {data: newPostPageData, headers: newPostPageHeaders} = await axios.get('https://seedtracker.org/newcassava/wp-admin/post-new.php?post_type=variety', {
    headers: {
      Cookie: loginCookies
    }
  })

  const { document } = (new JSDOM(newPostPageData)).window

  const formEl = document.querySelector('form#post')
  
  formEl.querySelector(`input[name="referredby"]`)['value'] = 'https://seedtracker.org/newcassava/wp-admin/edit.php?post_type=variety'
  formEl.querySelector(`input[name="_wp_original_http_referer"]`)['value'] = 'https://seedtracker.org/newcassava/wp-admin/edit.php?post_type=variety'
  formEl.querySelector(`input[name="auto_draft"]`)['value'] = ''

  formEl.querySelector(`input[name="post_title"]`)['value'] = variety['Variety Name']
  formEl.querySelector(`input[name="wpcf[variety-name]"]`)['value'] = variety['Variety Name']
  formEl.querySelector(`input[name="wpcf[original-name]"]`)['value'] = variety['Original Name']
  formEl.querySelector(`input[name="wpcf[year-of-release]"]`)['value'] = variety['Year of Release']
  formEl.querySelector(`textarea[name="wpcf[featured-traits]"]`)['value'] = variety['Featured traits']
  formEl.querySelector(`input[name="wpcf[more-details]"]`)['value'] = `<a href="${variety['More details']}" target="_blank" rel="noopener">More details</a>`

  const traitsArr = variety['Featured traits'].split(/,\s*|\s+and\s+/).map(text => text.trim().toLowerCase())

  Array.from(document.querySelectorAll('#traitchecklist li')).map( (el) => {
    if(el){
      const traitFrmCheckbox = el.textContent.trim().toLowerCase()
      const isTrait = traitsArr.some( (trait) => traitFrmCheckbox.includes( trait.slice(0,8) ) )
      if(isTrait){
        el.querySelector('input').checked = true
      }
    }
  } )

  // Check `Nigeria`
  document.getElementById('wpcf-fields-checkboxes-option-b1bc328ce47333eadb2434d8e0f12c6c-1')['checked'] = true

  

  const formData = new FormData()

  const inputs = Array.from(formEl.querySelectorAll('input'))
  const textareas = Array.from(formEl.querySelectorAll('textarea'))
  const allInputs = [...inputs, ...textareas]

  allInputs.forEach(inputEl => {
      if (!inputEl.hasAttribute('name')) {
          return
      }
      if (inputEl.type === 'checkbox' && !inputEl['checked']) {
          return
      }
      if(inputEl.name==='visibility'){
        return
      }
      const name = inputEl.name
      const value = inputEl['value'] || ''
      formData.append(name, value)
  })

  formData.append('visibility', 'public')

  const newCookies = loginCookies + '; ' + cookieArrToString(newPostPageHeaders['set-cookie'])

  const {data: uploadResponse, headers} = await axios.post('https://seedtracker.org/newcassava/wp-admin/post.php', formData, {
    headers: {
      Cookie: newCookies
    }
  })

  console.log(`${variety["Variety Name"]} uploaded.`)
}


export default uploadVariety
