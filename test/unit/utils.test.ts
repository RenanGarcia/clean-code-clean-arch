import { createSQLInsertFields, reduceArrayToCsv } from "~/utils"

test("Deve transformar um array de strings em uma lista CSV", () => {
  expect(reduceArrayToCsv(["A", "C", "B", "D"])).toBe("A, C, B, D")
})

test("Deve criar as strings de inserção de dados via SQL", () => {
  expect(createSQLInsertFields(["A", "C", "B", "D"])).toEqual({
    names: "A, C, B, D",
    values: "$1, $2, $3, $4",
  })
})
