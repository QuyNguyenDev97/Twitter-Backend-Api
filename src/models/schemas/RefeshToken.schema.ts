import { ObjectId } from 'mongodb'

export type RefeshTokenType = {
  _id?: ObjectId
  user_id: ObjectId
  token: string
  created_at?: Date
}

export default class RefeshToken {
  _id?: ObjectId
  user_id: ObjectId
  token: string
  created_at?: Date
  constructor({ _id, user_id, token, created_at }: RefeshTokenType) {
    this._id = _id
    this.user_id = user_id
    this.token = token
    this.created_at = created_at || new Date()
  }
}
