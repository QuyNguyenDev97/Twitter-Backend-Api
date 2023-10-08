import { config } from 'dotenv'
import { Collection, Db, MongoClient } from 'mongodb'
import User from '~/models/schemas/User.schema'

config()

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@twitter.8gabtj7.mongodb.net/?retryWrites=true&w=majority`

class DataBaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME)
  }
  async connect() {
    try {
      await this.db.command({ ping: 1 })
      console.log('connected to mongodb')
    } catch (error) {
      console.log('connect MongoDB error:', error)
    }
  }
  get user(): Collection<User> {
    return this.db.collection(process.env.DB_USER_COLLECTION as string)
  }
}

const dataBaseService = new DataBaseService()

export default dataBaseService
