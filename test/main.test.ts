import { sum } from "~/lib"

test("Deve somar 2+2", () => {
  expect(sum(2, 2)).toBe(4)
})
