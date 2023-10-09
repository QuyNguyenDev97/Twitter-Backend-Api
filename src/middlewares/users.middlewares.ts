import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import { USER_REPONSE_MESSAGES } from '~/constants/messages.contants'
import { userService } from '~/services/users.services'
import { validate } from '~/utils/validation'

export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({
      error: 'Missing email or password'
    })
  }
  next()
}

export const registerValidator = validate(
  checkSchema({
    name: {
      notEmpty: {
        errorMessage: USER_REPONSE_MESSAGES.NAME.IS_REQUIRED
      },
      isString: {
        errorMessage: USER_REPONSE_MESSAGES.NAME.MUST_BE_STRING
      },
      trim: true,
      isLength: {
        options: { min: 1, max: 100 },
        errorMessage: USER_REPONSE_MESSAGES.NAME.MUST_BE_FROM_1_TO_100_CHARACTERS
      }
    },
    email: {
      notEmpty: {
        errorMessage: USER_REPONSE_MESSAGES.EMAIL.IS_REQUIRED
      },
      isEmail: {
        errorMessage: USER_REPONSE_MESSAGES.EMAIL.IS_NOT_VALID
      },
      trim: true,
      custom: {
        options: async (value) => {
          const isEmailExit = await userService.checkEmailExit(value)
          if (isEmailExit) {
            throw new Error(USER_REPONSE_MESSAGES.EMAIL.ALREADY_EXISTS)
          }
          return isEmailExit
        }
      }
    },
    password: {
      trim: true,
      isString: {
        errorMessage: USER_REPONSE_MESSAGES.PASSWORD.MUST_BE_STRING
      },
      notEmpty: {
        errorMessage: USER_REPONSE_MESSAGES.PASSWORD.IS_REQUIRED
      },
      isLength: {
        options: { min: 8, max: 50 },
        errorMessage: USER_REPONSE_MESSAGES.PASSWORD.MUST_BE_FROM_8_TO_50_CHARACTERS
      },
      isStrongPassword: {
        options: {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minSymbols: 1
        },
        errorMessage: USER_REPONSE_MESSAGES.PASSWORD.IS_NOT_STRONG
      }
    },
    confirmPassword: {
      trim: true,
      isString: {
        errorMessage: USER_REPONSE_MESSAGES.CONFIRM_PASSWORD.MUST_BE_STRING
      },
      notEmpty: {
        errorMessage: USER_REPONSE_MESSAGES.CONFIRM_PASSWORD.IS_REQUIRED
      },
      isLength: {
        options: { min: 8, max: 50 },
        errorMessage: USER_REPONSE_MESSAGES.CONFIRM_PASSWORD.MUST_BE_FROM_8_TO_50_CHARACTERS
      },
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error(USER_REPONSE_MESSAGES.CONFIRM_PASSWORD.CONFIRM_PASSWORD_NOT_MATCH)
          }
          return true
        }
      }
    },
    date_of_birth: {
      notEmpty: {
        errorMessage: USER_REPONSE_MESSAGES.DATE_OF_BIRTH.IS_REQUIRED
      },
      isISO8601: {
        options: {
          strict: true,
          strictSeparator: true
        },
        errorMessage: USER_REPONSE_MESSAGES.DATE_OF_BIRTH.IS_NOT_VALID
      }
    }
  })
)
