import Position from "~/domain/entity/Position"
import UseCase from "~/application/usecase/UseCase"
import PositionRepository from "~/application/repository/PositionRepository"
import RideRepository from "~/application/repository/RideRepository"

export default class UpdatePosition implements UseCase {
  constructor(
    readonly rideRepository: RideRepository,
    readonly positionRepository: PositionRepository,
  ) {}

  async execute(input: Input): Promise<void> {
    const ride = await this.rideRepository.getRideById(input.rideId)
    if (ride.status !== "in_progress") {
      throw new Error("This ride is not in progress")
    }
    const position = Position.create(input)
    await this.positionRepository.savePosition(position)
  }
}

type Input = {
  rideId: string
  lat: number
  long: number
}
