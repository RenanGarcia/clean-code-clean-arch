import Ride from "~/domain/Ride"
import UseCase from "~/application/UseCase"
import AccountRepository from "~/infra/AccountRepository"
import RideRepository from "~/infra/RideRepository"

export default class RequestRide implements UseCase {
  constructor(
    readonly accountRepository: AccountRepository,
    readonly rideRepository: RideRepository,
  ) {}

  async execute(input: Input): Promise<Output> {
    const account = await this.accountRepository.getAccountById(
      input.passengerId,
    )
    if (!account.isPassenger) {
      throw new Error("Account is not from a passenger")
    }
    const existingRide = await this.rideRepository.getRideByPassengerId(
      input.passengerId,
    )
    if (existingRide) {
      throw new Error("Already exists a ride for this passenger")
    }
    const ride = Ride.create(
      input.passengerId,
      input.fromLat,
      input.fromLong,
      input.toLat,
      input.toLong,
    )
    await this.rideRepository.saveRide(ride)
    return { rideId: ride.rideId }
  }
}

type Input = {
  passengerId: string
  fromLat: number
  fromLong: number
  toLat: number
  toLong: number
}

type Output = {
  rideId: string
}
