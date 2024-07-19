import UseCase from "~/application/usecase/UseCase"
import RideRepository from "~/application/repository/RideRepository"

export default class StartRide implements UseCase {
  constructor(readonly rideRepository: RideRepository) {}

  async execute(input: string): Promise<void> {
    const ride = await this.rideRepository.getRideById(input)
    ride.start()
    await this.rideRepository.updateRide(ride)
  }
}
