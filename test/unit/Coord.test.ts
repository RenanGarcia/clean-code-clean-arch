import Coord from "~/domain/Coord"

test("Deve criar uma coordenada válida", () => {
  const lat = -27.584905257808835
  const long = -48.545022195325124
  const coord = new Coord(lat, long)
  expect(coord).toBeDefined()
  expect(coord.getLat()).toBe(lat)
  expect(coord.getLong()).toBe(long)
})

test("Não deve aceitar uma latitude inválida", () => {
  expect(() => new Coord(-91, -48.545022195325124)).toThrow(
    new Error("Invalid latitude"),
  )
  expect(() => new Coord(91, -48.545022195325124)).toThrow(
    new Error("Invalid latitude"),
  )
})

test("Não deve aceitar uma longitude inválida", () => {
  expect(() => new Coord(-27.584905257808835, -181)).toThrow(
    new Error("Invalid longitude"),
  )
  expect(() => new Coord(-27.584905257808835, 181)).toThrow(
    new Error("Invalid longitude"),
  )
})
