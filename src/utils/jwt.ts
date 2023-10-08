import jwt, { Secret, SignOptions } from 'jsonwebtoken'

type SignTokenParam = {
  payload: string | object | Buffer
  privateKey?: Secret
  options?: SignOptions
}

export const sighToken = ({
  payload,
  privateKey = process.env.JWT_SECRET as string,
  options = {
    algorithm: 'HS256'
  }
}: SignTokenParam) => {
  return new Promise<string>((resolve, rejects) => {
    jwt.sign(payload, privateKey, options, (error, token) => {
      if (error) {
        throw rejects(error)
      }
      resolve(token as string)
    })
  })
}
