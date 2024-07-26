import RequestRide from "~/application/usecase/RequestRide"
import GetRide from "~/application/usecase/GetRide"
import HttpServer from "~/infra/http/HttpServer"
import { inject } from "~/infra/di/Registry"

export default class RideController {
  @inject("httpServer")
  httpServer!: HttpServer

  @inject("requestRide")
  requestRide!: RequestRide

  @inject("getRide")
  getRide!: GetRide

  constructor() {
    this.httpServer.register("post", "/ride", async (_, body: any) => {
      return await this.requestRide.execute(body)
    })

    this.httpServer.register("get", "/rides/:{rideId}", async (params: any) => {
      return await this.getRide.execute(params.rideId)
    })
  }
}
