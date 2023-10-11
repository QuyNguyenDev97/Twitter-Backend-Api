import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { USER_REPONSE_MESSAGES } from '~/constants/messages.contants'
import { RegisterReqBody } from '~/models/requests/User.request'
import User from '~/models/schemas/User.schema'
import { userService } from '~/services/users.services'

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User
  const user_id = user._id as ObjectId
  const rs = await userService.login(user_id.toString())
  return res.status(200).json({
    message: USER_REPONSE_MESSAGES.LOGIN.SUCCESS,
    data: rs
  })
}

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterReqBody>,
  res: Response,
  next: NextFunction
) => {
  const rs = await userService.register(req.body)
  return res.status(200).json({
    message: USER_REPONSE_MESSAGES.REGISTER.SUCCESS,
    data: rs
  })
}
