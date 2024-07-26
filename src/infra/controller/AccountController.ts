import Signup from "~/application/usecase/Signup"
import GetAccount from "~/application/usecase/GetAccount"
import HttpServer from "~/infra/http/HttpServer"
import { inject } from "~/infra/di/Registry"

export default class AccountController {
  @inject("httpServer")
  httpServer!: HttpServer

  @inject("signup")
  signup!: Signup

  @inject("getAccount")
  getAccount!: GetAccount

  constructor() {
    this.httpServer.register(
      "post",
      "/signup",
      async (params: any, body: any) => {
        return await this.signup.execute(body)
      },
    )

    this.httpServer.register(
      "get",
      "/accounts/:{accountId}",
      async (params: any) => {
        return await this.getAccount.execute(params.accountId)
      },
    )
  }
}
