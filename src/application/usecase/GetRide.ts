import UseCase from "~/application/usecase/UseCase"
import RideRepository from "~/application/repository/RideRepository"
import AccountRepository from "~/application/repository/AccountRepository"

export default class GetRide implements UseCase {
  constructor(
    readonly accountRepository: AccountRepository,
    readonly rideRepository: RideRepository,
  ) {}

  async execute(rideId: string): Promise<Output> {
    const ride = await this.rideRepository.getRideById(rideId)
    const passenger = await this.accountRepository.getAccountById(
      ride.passengerId,
    )
    return {
      rideId: ride.rideId,
      passengerId: ride.passengerId,
      passengerName: passenger.getName(),
      passengerEmail: passenger.getEmail(),
      driverId: ride.driverId,
      status: ride.status,
      fromLat: ride.getFrom().getLat(),
      fromLong: ride.getFrom().getLong(),
      toLat: ride.getTo().getLat(),
      toLong: ride.getTo().getLong(),
      date: ride.date,
    }
  }
}

export type Output = {
  rideId: string
  passengerId: string
  passengerName: string
  passengerEmail: string
  driverId?: string
  status: string
  fromLat: number
  fromLong: number
  toLat: number
  toLong: number
  date: Date
}
