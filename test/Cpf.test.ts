import Cpf from "~/Cpf"

test.each(["763.410.050-16", "71428793860", "87748248800"])(
  "Deve testar se o cpf é valido: %s",
  (cpf: string) => {
    expect(new Cpf(cpf)).toBeDefined()
  },
)

test.each([
  "",
  null,
  undefined,
  "123456",
  "1234567891011121314",
  "11111111111",
])("Deve testar se o cpf é inválido: %s", (cpf: any) => {
  expect(() => new Cpf(cpf)).toThrow(new Error("Invalid CPF"))
})
