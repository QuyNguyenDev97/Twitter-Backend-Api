import User from '~/models/schemas/User.schema'
import dataBaseService from './database.services'
import { RegisterReqBody } from '~/models/requests/User.request'
import { hashPassword } from '~/utils/hashPassword'
import { sighToken } from '~/utils/jwt'
import { TokenType } from '~/constants/enum'

class UserService {
  private signAccessToken(user_id: string) {
    return sighToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken
      },
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
        algorithm: 'HS256'
      }
    })
  }
  private signRefeshToken(user_id: string) {
    return sighToken({
      payload: {
        user_id,
        token_type: TokenType.RefeshToken
      },
      options: {
        expiresIn: process.env.REFESH_TOKEN_EXPIRES_IN,
        algorithm: 'HS256'
      }
    })
  }
  async register(payload: RegisterReqBody) {
    const rs = await dataBaseService.user.insertOne(
      new User({ ...payload, date_of_birth: new Date(payload.date_of_bird), password: hashPassword(payload.password) })
    )
    const user_id = rs.insertedId.toString()
    const [access_token, refesh_token] = await Promise.all([
      this.signAccessToken(user_id),
      this.signRefeshToken(user_id)
    ])
    return { access_token, refesh_token }
  }
  async checkEmailExit(email: string) {
    const user = await dataBaseService.user.findOne({ email })
    return Boolean(user)
  }
}

export const userService = new UserService()
