import RequestRide from "~/application/usecase/RequestRide"
import GetRide from "~/application/usecase/GetRide"
import HttpServer from "~/infra/http/HttpServer"

export default class RideController {
  constructor(
    readonly httpServer: HttpServer,
    readonly requestRide: RequestRide,
    readonly getRide: GetRide,
  ) {
    this.httpServer.register("post", "/ride", async (_, body: any) => {
      return await this.requestRide.execute(body)
    })

    this.httpServer.register("get", "/rides/:{rideId}", async (params: any) => {
      return await this.getRide.execute(params.rideId)
    })
  }
}
