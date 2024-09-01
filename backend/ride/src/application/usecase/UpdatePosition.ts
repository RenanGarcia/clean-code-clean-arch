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
    const position = Position.create(input)
    const lastPosition =
      await this.positionRepository.getLastPositionFromRideId(input.rideId)
    if (lastPosition) ride.updatePosition(lastPosition, position)
    await this.positionRepository.savePosition(position)
    await this.rideRepository.updateRide(ride)
  }
}

type Input = {
  rideId: string
  lat: number
  long: number
  date: Date
}
