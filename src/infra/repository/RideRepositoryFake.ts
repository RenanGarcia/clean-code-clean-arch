import Ride from "~/domain/Ride"
import RideRepository from "~/application/repository/RideRepository"
import { UNFINISHED_RIDE_STATUS } from "~/constants"

export default class RideRepositoryFake implements RideRepository {
  rides: Ride[]

  constructor() {
    this.rides = []
  }

  async getActiveRideByPassengerId(passengerId: string) {
    return this.rides.find((ride) => {
      return (
        ride.passengerId === passengerId &&
        UNFINISHED_RIDE_STATUS.find((status) => status === ride.status)
      )
    })
  }

  async getRideById(rideId: string) {
    const account = this.rides.find((ride) => ride.rideId === rideId)
    if (!account) throw new Error("Ride not found")
    return account
  }

  async saveRide(ride: Ride) {
    this.rides.push(ride)
  }
}
