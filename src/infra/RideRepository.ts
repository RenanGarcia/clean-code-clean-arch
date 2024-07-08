import Ride from "~/domain/Ride"

export default interface RideRepository {
  getRideByPassengerId(passengerId: string): Promise<Ride | undefined>
  getRideById(rideId: string): Promise<Ride>
  saveRide(ride: Ride): Promise<void>
}

export class RideRepositoryMemory implements RideRepository {
  rides: Ride[]

  constructor() {
    this.rides = []
  }

  async getRideByPassengerId(passengerId: string) {
    return this.rides.find((ride) => ride.passengerId === passengerId)
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
