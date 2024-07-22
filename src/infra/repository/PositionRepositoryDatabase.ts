import Position from "~/domain/entity/Position"
import PositionRepository from "~/application/repository/PositionRepository"
import DatabaseConnection from "~/infra/database/DatabaseConnection"

export default class PositionRepositoryDatabase implements PositionRepository {
  constructor(readonly connection: DatabaseConnection) {}

  async savePosition(position: Position) {
    await this.connection.query(
      "insert into cccat17.position (position_id, ride_id, lat, long, date) values ($1, $2, $3, $4, $5)",
      [
        position.positionId,
        position.rideId,
        position.coord.getLat(),
        position.coord.getLong(),
        position.date,
      ],
    )
  }

  async getLastPositionFromRideId(rideId: string | undefined) {
    const [positionData] = await this.connection.query(
      `select * from cccat17.position where ride_id = $1 order by date desc limit 1`,
      [rideId],
    )
    if (!positionData) return
    return new Position({
      positionId: positionData.position_id,
      rideId: positionData.ride_id,
      lat: parseFloat(positionData.lat),
      long: parseFloat(positionData.long),
      date: positionData.date,
    })
  }
}
