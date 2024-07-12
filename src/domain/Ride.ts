import crypto from "crypto"

import Coord from "~/domain/Coord"

export default class Ride {
  private from: Coord
  private to: Coord

  constructor(
    readonly rideId: string,
    readonly passengerId: string,
    readonly status: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
    readonly date: Date,
  ) {
    this.from = new Coord(fromLat, fromLong)
    this.to = new Coord(toLat, toLong)
  }

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

  getFrom() {
    return this.from
  }

  getTo() {
    return this.to
  }
}
