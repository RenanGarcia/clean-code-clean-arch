import crypto from "crypto"

import Coord from "~/domain/Coord"
import Account from "~/domain/Account"

export type RideProps = {
  rideId?: string
  passengerId: string
  status?: string
  fromLat: number
  fromLong: number
  toLat: number
  toLong: number
  date?: Date
  driverId?: string
}

export type MandatoryRideProps = RideProps & {
  rideId: string
  status: string
  date: Date
}

export default class Ride {
  private from: Coord
  private to: Coord
  status: string
  driverId?: string
  readonly rideId: string
  readonly passengerId: string
  readonly date: Date

  constructor({
    rideId,
    passengerId,
    status,
    fromLat,
    fromLong,
    toLat,
    toLong,
    date,
    driverId,
  }: MandatoryRideProps) {
    this.rideId = rideId
    this.passengerId = passengerId
    this.status = status
    this.from = new Coord(fromLat, fromLong)
    this.to = new Coord(toLat, toLong)
    this.date = date
    this.driverId = driverId
  }

  // Pattern: Static Fabric Method
  static create(props: RideProps) {
    return new Ride({
      ...props,
      rideId: crypto.randomUUID(),
      status: "requested",
      date: new Date(),
    })
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
