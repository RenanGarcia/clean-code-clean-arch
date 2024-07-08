import crypto from "crypto"

export default class Ride {
  constructor(
    readonly rideId: string,
    readonly passengerId: string,
    readonly status: string,
    readonly fromLat: number,
    readonly fromLong: number,
    readonly toLat: number,
    readonly toLong: number,
    readonly date: Date,
  ) {}

  // Pattern: Static Fabric Method
  static create(
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
  ) {
    return new Ride(
      crypto.randomUUID(),
      passengerId,
      "requested",
      fromLat,
      fromLong,
      toLat,
      toLong,
      new Date(),
    )
  }
}
