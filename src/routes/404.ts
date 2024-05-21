import { NextFunction, Request, Response } from "express";



const NotFound = (req: Request, res: Response, next: NextFunction) => {
    const error: any = new Error('Not Found')
    error['status'] = 404
  
    res.status(error['status'])
  
    res.json({
        success: false,
        message: `This route does not exist`,
    })
    next()
}

export default NotFound