import { body } from "express-validator"
import excelToJson from 'convert-excel-to-json'
import path from "path"
import objectify from "../../utils/objectify"

const requiredKeys = [
    "Title",
    "Country",
    "Name",
    "Organization",
    "Address",
    "Location",
    "Variety",
    "Variety Details",
    "Type of Seed",
    "Date of planting",
    "Size of Field",
    "Production Year",
    "Phone",
    "Email"
]


const UploadProdDataDto = [
    body('username')
    .notEmpty()
    .withMessage('Username cannot be empty'),
    body('password')
    .notEmpty()
    .withMessage('Password cannot be empty'),
    body()
    .custom((body, { req }) => {
        if (!body.data && !req.file) {
            throw new Error('Either data or file must be provided')
        }
        if (body.data && req.file) {
            throw new Error('Both data and file cannot be provided at the same time')
        }
        return true;
    }),

    body('data')
    .optional()
    .isArray({ min: 1 }).withMessage('Data must be a non-empty array')
    .bail()
    .custom((array) => {
        array.forEach((item, index) => {
            if (typeof item !== 'object' || item === null || Array.isArray(item)) {
                throw new Error(`Item at index ${index} is not an object`)
            }
            requiredKeys.forEach((key) => {
                if (!item.hasOwnProperty(key)) {
                    throw new Error(`Item at index ${index} is missing key: '${key}'`)
                }

                if (typeof item[key] !== 'string') {
                    throw new Error(`Key "${key}" in item at index ${index} must be a string`)
                }
            })
        })
        return true
    }),
    
    body()
    .custom((body, { req }) => {
        const file = req.file
        if (file) {
            const file = req.file
            const fileExtension = path.extname(file.originalname).toLowerCase()
            const allowedExtensions = ['.xls', '.xlsx']
            const allowedMimeTypes = [
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            ];
            if (!allowedExtensions.includes(fileExtension) || !allowedMimeTypes.includes(file.mimetype)) {
                throw new Error('Invalid file type. Only Excel files are allowed.')
            }
            const result = excelToJson({
                source: file.buffer,
                sheets: ['data'],
            })

            const data = result.data
            if(!data || !data.length){
                throw new Error('Excel file does not have a `data` sheet.')
            }
            
            const headers = Object.entries(data[0] as {[key: string]: any})

            const formattedData = data.slice(1).map(row => {
                const rowObject = {}
                
                headers.forEach( (header, index) => {
                    rowObject[header[1]] = row[header[0]] || ''
                } )
                return rowObject
            })

            formattedData.forEach((item, index) => {
                requiredKeys.forEach((key) => {
                    if (!item.hasOwnProperty(key)) {
                        throw new Error(`Excel Sheet is missing header: '${key}'`)
                    }
                })
            })

            req.body['data'] = objectify(formattedData)
        }
        return true;
    }),
]


export default UploadProdDataDto