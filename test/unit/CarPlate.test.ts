import CarPlate from "~/domain/CarPlate"

test("Deve criar uma placa válida", () => {
  const inputValue = "MVD2030"
  const carPlate = new CarPlate(inputValue)
  expect(carPlate).toBeDefined()
  expect(carPlate.getValue()).toBe(inputValue)
})

test.each(["", null, undefined, "1234"])(
  "Não deve permitir criar uma placa com valor vazio: [%s]",
  (input: any) => {
    expect(() => new CarPlate(input)).toThrow(new Error("Invalid car plate"))
  },
)
