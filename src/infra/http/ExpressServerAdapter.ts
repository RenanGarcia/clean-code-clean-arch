import Express from "express"
import HttpServer, { HttpMethod, RequestHandler } from "~/infra/http/HttpServer"

export default class ExpressServerAdapter implements HttpServer {
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
