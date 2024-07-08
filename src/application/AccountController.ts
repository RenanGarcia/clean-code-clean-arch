import Signup from "~/application/Signup"
import GetAccount from "~/application/GetAccount"
import HttpServer from "~/infra/HttpServer"

export default class AccountController {
  constructor(
    readonly httpServer: HttpServer,
    readonly signup: Signup,
    readonly getAccount: GetAccount,
  ) {
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
      async (params: any, body: any) => {
        return await this.getAccount.execute(params.accountId)
      },
    )
  }
}
