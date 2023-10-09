import { NextFunction, Request, Response } from 'express'
import { omit } from 'lodash'
import { ServerStatus } from '~/constants/enum'
import { ErrorWithStatusType } from '~/models/Errors'

export const defaultErrorHandler = (err: ErrorWithStatusType, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || ServerStatus.INTERNAL_SERVER_ERROR).json(omit(err, 'status'))
}
