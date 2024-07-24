import crypto from "crypto"

import Coord from "~/domain/vo/Coord"
import Account from "~/domain/entity/Account"
import Segment from "~/domain/vo/Segment"
import Position from "~/domain/entity/Position"

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
  distance?: number
}

export type MandatoryRideProps = RideProps & {
  rideId: string
  status: string
  date: Date
  distance: number
}

/**
 * Entity Ride
 * Aggregate root Ride that contains:
 *   - Coord
 */
export default class Ride {
  readonly rideId: string
  readonly passengerId: string
  readonly date: Date
  private from: Coord
  private to: Coord
  status: string
  driverId?: string
  distance: number

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
    distance,
  }: MandatoryRideProps) {
    this.rideId = rideId
    this.passengerId = passengerId
    this.status = status
    this.from = new Coord(fromLat, fromLong)
    this.to = new Coord(toLat, toLong)
    this.date = date
    this.driverId = driverId
    this.distance = distance
  }

  // Pattern: Static Fabric Method
  static create(props: RideProps) {
    return new Ride({
      ...props,
      rideId: crypto.randomUUID(),
      status: "requested",
      date: new Date(),
      distance: 0,
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

  start() {
    if (this.status !== "accepted") throw new Error("Ivalid ride status")
    this.status = "in_progress"
  }

  updatePosition(lastPosition: Position, currentPosition: Position) {
    if (this.status !== "in_progress") throw new Error("Ivalid ride status")
    const segment = new Segment(lastPosition.coord, currentPosition.coord)
    const distance = segment.getDistance()
    this.distance += distance
  }
}
