import { FareCalculatorFactory } from "~/domain/service/FareCalculator"

test("Deve calcular a taxa de uma corrida no horário comercial", () => {
  const distance = 10
  const date = new Date("2023-03-01T10:10:00")
  expect(FareCalculatorFactory.create(date).calculate(distance)).toBe(21)
})

test("Deve calcular a taxa de uma corrida no horário noturno", () => {
  const distance = 10
  const date = new Date("2023-03-01T23:10:00")
  expect(FareCalculatorFactory.create(date).calculate(distance)).toBe(39)
})

test("Deve calcular a taxa de uma corrida num domingo", () => {
  const distance = 10
  const date = new Date("2021-03-07T10:10:00")
  expect(FareCalculatorFactory.create(date).calculate(distance)).toBe(50)
})
