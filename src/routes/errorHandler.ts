import { Request, Response } from "express";

interface IRequestHandler {
    message: string;
    data?: any;
    status?: number;
}
const withErrorHandler = (handler: (req: Request, res: Response, ...args: any[]) => Promise<IRequestHandler | void>) => {
  return async (req: Request, res: Response, ...args: any[]) => {
      try {
          const response: any =  await handler(req, res, ...args);
          const status = response?.status
          
          if(response){
              return res.status(status || 200).json({
                  success: true,
                  ...response,
                  data: response?.data || null,
                  status: undefined,
              })
          }
          return
      } 
      catch (err: any) {
          res.status(err.status || 500).json({
              success: false,
              message: err.message,
              data: null,
          });
      }
  };
}


export default withErrorHandler