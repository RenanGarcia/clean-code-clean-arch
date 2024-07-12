import CarPlate from "~/domain/CarPlate"

test("Deve criar uma placa válida", () => {
  const inputValue = "MVD2030"
  const carPlate = new CarPlate(inputValue)
  expect(carPlate).toBeDefined()
  expect(carPlate.getValue()).toBe(inputValue)
})

test("Deve permitir criar uma placa com valor vazio", () => {
  const inputValue = ""
  const carPlate = new CarPlate(inputValue)
  expect(carPlate).toBeDefined()
  expect(carPlate.getValue()).toBe(inputValue)
})

test("Não deve criar uma placa inválida", () => {
  expect(() => new CarPlate("123")).toThrow(new Error("Invalid car plate"))
})
