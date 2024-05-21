class CustomError extends Error {
    status: number

    constructor(message: string, status: number) {
        super(message)
        this.status = status
    }
}

const error = (message: any, status: number = 500): never => {
    throw new CustomError(message, status)
}

export default error