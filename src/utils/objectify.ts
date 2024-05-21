
const objectify = <T>(classInstance: T): T => JSON.parse(JSON.stringify(classInstance))

export default objectify