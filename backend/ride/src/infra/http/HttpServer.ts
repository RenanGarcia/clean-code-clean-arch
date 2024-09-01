export type HttpMethod =
  | "all"
  | "get"
  | "post"
  | "put"
  | "delete"
  | "patch"
  | "options"
  | "head"
export type RequestHandler = (params: any, req: any) => void

export default interface HttpServer {
  register(method: HttpMethod, url: string, callback: RequestHandler): void
  listen(port: number): void
}
