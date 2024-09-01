import Position from "~/domain/entity/Position"
import PositionRepository from "~/application/repository/PositionRepository"

export default class PositionRepositoryFake implements PositionRepository {
  positions: Position[]

  constructor() {
    this.positions = []
  }

  async savePosition(position: Position) {
    this.positions.push(position)
  }

  async getLastPositionFromRideId(rideId: string) {
    const ridePositions = this.positions.filter((r) => r.rideId === rideId)
    if (!ridePositions.length) return
    const lastPositionIndex = ridePositions.length - 1
    return ridePositions[lastPositionIndex]
  }
}
