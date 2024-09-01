import Hapi from "@hapi/hapi"
import HttpServer, { HttpMethod, RequestHandler } from "~/infra/http/HttpServer"

export default class HapiServerAdapter implements HttpServer {
  server: Hapi.Server

  constructor() {
    this.server = Hapi.server({})
  }

  register(method: HttpMethod, url: string, callback: RequestHandler) {
    this.server.route({
      method,
      path: url.replace(":", ""),
      handler: async (request, reply) => {
        try {
          const output = await callback(request.params, request.payload)
          return output
        } catch (err: any) {
          console.log(err.message)
          return reply.response({ message: err.message }).code(422)
        }
      },
    })
  }

  listen(port: number) {
    this.server.settings.port = port
    this.server.start()
  }
}
