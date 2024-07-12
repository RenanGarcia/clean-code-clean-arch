import Ride from "~/domain/Ride"
import RideRepository from "~/application/repository/RideRepository"
import DatabaseConnection from "~/infra/database/DatabaseConnection"

const UNFINISHED_RIDE_STATUS = "'requested', 'accepted', 'in_progress'"

export class RideRepositoryDatabase implements RideRepository {
  constructor(readonly connection: DatabaseConnection) {}

  async getActiveRideByPassengerId(passengerId: string) {
    const [rideData] = await this.connection.query(
      `select * from cccat17.ride where passenger_id = $1 and status in (${UNFINISHED_RIDE_STATUS})`,
      [passengerId],
    )
    if (!rideData) return
    return new Ride(
      rideData.ride_id,
      rideData.passenger_id,
      rideData.status,
      parseFloat(rideData.from_lat),
      parseFloat(rideData.from_long),
      parseFloat(rideData.to_lat),
      parseFloat(rideData.to_long),
      rideData.date,
    )
  }

  async getRideById(rideId: string) {
    const [rideData] = await this.connection.query(
      "select * from cccat17.ride where ride_id = $1",
      [rideId],
    )
    if (!rideData) throw new Error("Ride not found")
    return new Ride(
      rideData.ride_id,
      rideData.passenger_id,
      rideData.status,
      parseFloat(rideData.from_lat),
      parseFloat(rideData.from_long),
      parseFloat(rideData.to_lat),
      parseFloat(rideData.to_long),
      rideData.date,
    )
  }

  async saveRide(ride: Ride) {
    await this.connection.query(
      "insert into cccat17.ride (ride_id, passenger_id, driver_id, status, fare, distance, from_lat, from_long, to_lat, to_long, date) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
      [
        ride.rideId,
        ride.passengerId,
        null, // ride.driverId,
        ride.status,
        null, // ride.fare,
        null, // ride.distance,
        ride.getFrom().getLat(),
        ride.getFrom().getLong(),
        ride.getTo().getLat(),
        ride.getTo().getLong(),
        ride.date,
      ],
    )
  }
}

export class RideRepositoryMemory implements RideRepository {
  rides: Ride[]

  constructor() {
    this.rides = []
  }

  async getActiveRideByPassengerId(passengerId: string) {
    return this.rides.find((ride) => {
      return (
        ride.passengerId === passengerId &&
        UNFINISHED_RIDE_STATUS.match(ride.status)
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
