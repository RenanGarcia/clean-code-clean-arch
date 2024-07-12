import Ride from "~/domain/Ride"

export default interface RideRepository {
  getActiveRideByPassengerId(passengerId: string): Promise<Ride | undefined>
  getRideById(rideId: string): Promise<Ride>
  saveRide(ride: Ride): Promise<void>
}
