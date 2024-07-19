import Ride from "~/domain/Ride"
import RideRepository from "~/application/repository/RideRepository"
import { ACTIVE_RIDE_STATUS, UNFINISHED_RIDE_STATUS } from "~/constants"

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

  async getActiveRideByDriverId(driverId: string) {
    return this.rides.find(
      (ride) =>
        ride.driverId === driverId &&
        ACTIVE_RIDE_STATUS.find((status) => status === ride.status),
    )
  }

  async getRideById(rideId: string) {
    const ride = this.rides.find((ride) => ride.rideId === rideId)
    if (!ride) throw new Error("Ride not found")
    return ride
  }

  async saveRide(ride: Ride) {
    this.rides.push(ride)
  }

  async updateRide(ride: Ride): Promise<void> {
    let hasRide = false
    this.rides.forEach((r, index) => {
      if (r.rideId === ride.rideId) {
        this.rides[index] = ride
        hasRide = true
      }
    })
    if (!hasRide) throw new Error("Ride not found")
  }
}
