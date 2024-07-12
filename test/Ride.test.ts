import Ride from "~/domain/Ride"

test("Não deve criar corrida com coordenada inválida", () => {
  expect(() => Ride.create("", -180, 180, -180, 180)).toThrow(
    new Error("Invalid latitude"),
  )
})
