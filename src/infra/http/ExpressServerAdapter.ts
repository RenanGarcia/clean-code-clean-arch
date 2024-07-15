import Express from "express"
import HttpServer, { HttpMethod, RequestHandler } from "~/infra/http/HttpServer"

export default class ExpressServerAdapter implements HttpServer {
  server: Express.Application

  constructor() {
    this.server = Express()
    this.server.use(Express.json())
  }

  register(method: HttpMethod, url: string, callback: RequestHandler) {
    const urlReplaced = url.replace(/[{}]/g, "")
    this.server[method](urlReplaced, async (req: any, res: any) => {
      try {
        const output = await callback(req.params, req.body)
        return res.json(output)
      } catch (err: any) {
        return res.status(422).json({ message: err.message })
      }
    })
  }

  listen(port: number) {
    this.server.listen(port)
  }
}
