export interface RegisterReqBody {
  name: string
  email: string
  password: string
  confim_password: string
  date_of_bird: string
}

export interface LoginReqBody {
  email: string
  password: string
}
