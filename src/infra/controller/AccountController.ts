import Signup from "~/application/usecase/Signup"
import GetAccount from "~/application/usecase/GetAccount"
import HttpServer from "~/infra/http/HttpServer"

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
