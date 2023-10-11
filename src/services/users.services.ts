import User from '~/models/schemas/User.schema'
import dataBaseService from './database.services'
import { LoginReqBody, RegisterReqBody } from '~/models/requests/User.request'
import { hashPassword } from '~/utils/hashPassword'
import { sighToken } from '~/utils/jwt'
import { TokenType } from '~/constants/enum'
import RefeshToken from '~/models/schemas/RefeshToken.schema'
import { ObjectId } from 'mongodb'
import { config } from 'dotenv'
config()

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
  private async signAccessAndRefeshToken(user_id: string) {
    return await Promise.all([this.signAccessToken(user_id), this.signRefeshToken(user_id)])
  }
  async checkEmailExit(email: string) {
    const user = await dataBaseService.user.findOne({ email })
    return Boolean(user)
  }
  async register(payload: RegisterReqBody) {
    const rs = await dataBaseService.user.insertOne(
      new User({ ...payload, date_of_birth: new Date(payload.date_of_bird), password: hashPassword(payload.password) })
    )
    const user_id = rs.insertedId.toString()
    const [access_token, refesh_token] = await this.signAccessAndRefeshToken(user_id.toString())
    dataBaseService.refeshToken.insertOne(new RefeshToken({ user_id: new ObjectId(user_id), token: refesh_token }))
    return { access_token, refesh_token }
  }
  async login(user_id: string) {
    const [access_token, refesh_token] = await this.signAccessAndRefeshToken(user_id)
    dataBaseService.refeshToken.insertOne(new RefeshToken({ user_id: new ObjectId(user_id), token: refesh_token }))
    return { access_token, refesh_token }
  }
}

export const userService = new UserService()
