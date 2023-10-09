import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { RegisterReqBody } from '~/models/requests/User.request'
import { userService } from '~/services/users.services'

export const loginController = (req: Request, res: Response) => {
  res.json({
    data: ['haha']
  })
}

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterReqBody>,
  res: Response,
  next: NextFunction
) => {
  const rs = await userService.register(req.body)
  return res.status(200).json({
    message: 'Login Success',
    data: rs
  })
}
