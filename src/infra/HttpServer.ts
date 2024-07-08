import Express from "express"
import Hapi from "@hapi/hapi"

type HttpMethod =
  | "all"
  | "get"
  | "post"
  | "put"
  | "delete"
  | "patch"
  | "options"
  | "head"
type RequestHandler = (params: any, req: any) => void

export default interface HttpServer {
  register(method: HttpMethod, url: string, callback: RequestHandler): void
  listen(port: number): void
}

export class ExpressServerAdpter implements HttpServer {
  app: Express.Application

  constructor() {
    this.app = Express()
    this.app.use(Express.json())
  }

  register(method: HttpMethod, url: string, callback: RequestHandler) {
    this.app[method](url.replace(/[{}]/g, ""), async (req: any, res: any) => {
      try {
        const output = await callback(req.params, req.body)
        return res.json(output)
      } catch (err: any) {
        return res.status(422).json({ message: err.message })
      }
    })
  }

  listen(port: number) {
    this.app.listen(port)
  }
}

export class HapiServerAdpter implements HttpServer {
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
