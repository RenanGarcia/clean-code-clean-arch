import Ride from "~/domain/Ride"
import RideRepository from "~/application/repository/RideRepository"
import DatabaseConnection from "~/infra/database/DatabaseConnection"
import { ACTIVE_RIDE_STATUS, UNFINISHED_RIDE_STATUS } from "~/constants"

export default class RideRepositoryDatabase implements RideRepository {
  constructor(readonly connection: DatabaseConnection) {}

  async getActiveRideByPassengerId(passengerId: string) {
    const unfinishedStatus = UNFINISHED_RIDE_STATUS.reduce(
      (acc, status, index) => `${acc}${index > 0 ? ", " : ""}'${status}'`,
      "",
    )
    const [rideData] = await this.connection.query(
      `select * from cccat17.ride where passenger_id = $1 and status in (${unfinishedStatus})`,
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
      rideData.driver_id,
    )
  }

  async getActiveRideByDriverId(driverId: string) {
    const activeRideStatuses = ACTIVE_RIDE_STATUS.reduce(
      (acc, status, index) => `${acc}${index > 0 ? ", " : ""}'${status}'`,
      "",
    )
    const [rideData] = await this.connection.query(
      `select * from cccat17.ride where driver_id = $1 and status in (${activeRideStatuses})`,
      [driverId],
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
      rideData.driver_id,
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
      rideData.driver_id,
    )
  }

  async saveRide(ride: Ride) {
    await this.connection.query(
      "insert into cccat17.ride (ride_id, passenger_id, driver_id, status, fare, distance, from_lat, from_long, to_lat, to_long, date) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
      [
        ride.rideId,
        ride.passengerId,
        ride.driverId,
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

  async updateRide(ride: Ride) {
    await this.connection.query(
      "update cccat17.ride set driver_id = $1, status = $2 where ride_id = $3",
      [ride.driverId, ride.status, ride.rideId],
    )
  }
}