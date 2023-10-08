import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import User from '~/models/schemas/User.schema'
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
      notEmpty: true,
      isString: true,
      trim: true,
      isLength: { options: { min: 1, max: 100 } }
    },
    email: {
      notEmpty: true,
      isEmail: true,
      trim: true,
      custom: {
        options: async (value) => {
          const isEmailExit = await userService.checkEmailExit(value)
          if (isEmailExit) throw new Error('This email is exit')
          return isEmailExit
        }
      }
    },
    password: {
      trim: true,
      isString: true,
      notEmpty: true,
      isLength: { options: { min: 8, max: 50 } },
      isStrongPassword: {
        options: {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minSymbols: 1
        }
      }
    },
    confirmPassword: {
      trim: true,
      isString: true,
      notEmpty: true,
      isLength: { options: { min: 8, max: 50 } },
      isStrongPassword: {
        options: {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minSymbols: 1
        }
      },
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password')
          }
          return true
        }
      }
    },
    date_of_birth: {
      notEmpty: true,
      isISO8601: {
        options: {
          strict: true,
          strictSeparator: true
        }
      }
    }
  })
)
