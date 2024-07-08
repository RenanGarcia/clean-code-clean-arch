import UseCase from "~/application/UseCase"
import RideRepository from "~/infra/RideRepository"
import AccountRepository from "~/infra/AccountRepository"

export default class GetRide implements UseCase {
  constructor(
    readonly accountRepository: AccountRepository,
    readonly rideRepository: RideRepository,
  ) {}
  async execute(input: Input): Promise<Output> {
    const ride = await this.rideRepository.getRideById(input.rideId)
    const passenger = await this.accountRepository.getAccountById(
      ride.passengerId,
    )
    return {
      rideId: ride.rideId,
      passengerId: ride.passengerId,
      passengerName: passenger.name,
      passengerEmail: passenger.email,
      status: ride.status,
      fromLat: ride.fromLat,
      fromLong: ride.fromLong,
      toLat: ride.toLat,
      toLong: ride.toLong,
      date: ride.date,
    }
  }
}

type Input = {
  rideId: string
}
type Output = {
  rideId: string
  passengerId: string
  passengerName: string
  passengerEmail: string
  status: string
  fromLat: number
  fromLong: number
  toLat: number
  toLong: number
  date: Date
}
