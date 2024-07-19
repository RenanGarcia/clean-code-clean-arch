import Ride from "~/domain/Ride"

export default interface RideRepository {
  saveRide(ride: Ride): Promise<void>
  updateRide(ride: Ride): Promise<void>
  getRideById(rideId: string): Promise<Ride>
  getActiveRideByPassengerId(passengerId: string): Promise<Ride | undefined>
  getActiveRideByDriverId(driverId: string): Promise<Ride | undefined>
}
