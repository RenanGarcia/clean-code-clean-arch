import crypto from "crypto"

import Coord from "~/domain/Coord"
import Account from "~/domain/Account"

export default class Ride {
  private from: Coord
  private to: Coord
  status: string
  driverId?: string

  constructor(
    readonly rideId: string,
    readonly passengerId: string,
    status: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
    readonly date: Date,
    driverId?: string,
  ) {
    this.from = new Coord(fromLat, fromLong)
    this.to = new Coord(toLat, toLong)
    this.driverId = driverId
    this.status = status
  }

  // Pattern: Static Fabric Method
  static create(
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
    rideId?: string,
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
      rideId,
    )
  }

  getFrom() {
    return this.from
  }

  getTo() {
    return this.to
  }

  accept(driver: Account) {
    if (!driver.isDriver) throw new Error("This account is not a driver")
    if (this.status !== "requested") throw new Error("Ivalid ride status")
    this.driverId = driver.accountId
    this.status = "accepted"
  }
}
