import { validateCpf } from "~/validateCpf"

test.each(["763.410.050-16", "71428793860", "87748248800"])(
  "Deve testar se o cpf é valido: %s",
  (cpf: string) => {
    const isValid = validateCpf(cpf)
    expect(isValid).toBe(true)
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
  const isValid = validateCpf(cpf)
  expect(isValid).toBe(false)
})
