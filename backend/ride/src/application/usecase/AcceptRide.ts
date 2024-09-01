import UseCase from "~/application/usecase/UseCase"
import AccountRepository from "~/application/repository/AccountRepository"
import RideRepository from "~/application/repository/RideRepository"

export default class AcceptRide implements UseCase {
  constructor(
    readonly accountRepository: AccountRepository,
    readonly rideRepository: RideRepository,
  ) {}

  async execute(input: Input): Promise<void> {
    const existingRide = await this.rideRepository.getActiveRideByDriverId(
      input.driverId,
    )
    if (existingRide) throw new Error("Already exists a ride for this driver")
    const driverAccount = await this.accountRepository.getAccountById(
      input.driverId,
    )
    const ride = await this.rideRepository.getRideById(input.rideId)
    ride.accept(driverAccount)
    await this.rideRepository.updateRide(ride)
  }
}

type Input = {
  rideId: string
  driverId: string
}
