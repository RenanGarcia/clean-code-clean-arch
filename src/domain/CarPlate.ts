export default class CarPlate {
  private value: string
  private CAR_PLATE_PATTERN = /[A-Z]{3}[0-9]{4}/

  constructor(carPlate?: string) {
    if (carPlate && !carPlate.match(this.CAR_PLATE_PATTERN))
      throw new Error("Invalid car plate")
    this.value = carPlate || ""
  }

  isValid() {
    return this.value.match(this.CAR_PLATE_PATTERN)
  }

  getValue() {
    return this.value
  }
}
