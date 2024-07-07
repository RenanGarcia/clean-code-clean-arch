import Signup from "./Signup"
import GetAccount from "./GetAccount"
import HttpServer from "./HttpServer"

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
