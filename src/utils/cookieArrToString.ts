


const cookieArrToString = (arr:string[]) => arr.map(cookie => cookie.split(';')[0]).join('; ')


export default cookieArrToString