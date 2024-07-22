import crypto from "crypto"

import Coord from "~/domain/Coord"

export type PositionProps = {
  positionId?: string
  rideId: string
  lat: number
  long: number
  date?: Date
}

export type MandatoryPositionProps = PositionProps & {
  positionId: string
  date: Date
}

/**
 * Entity Position
 * Aggregate root Position that contains:
 *   - Coord
 */
export default class Position {
  readonly positionId: string
  readonly rideId: string
  readonly date: Date
  readonly coord: Coord

  constructor({ positionId, rideId, lat, long, date }: MandatoryPositionProps) {
    if (!rideId) throw new Error("Position has not a rideId")
    this.positionId = positionId
    this.rideId = rideId
    this.coord = new Coord(lat, long)
    this.date = date
  }

  // Pattern: Static Fabric Method
  static create(props: PositionProps) {
    return new Position({
      ...props,
      positionId: crypto.randomUUID(),
      date: new Date(),
    })
  }
}
