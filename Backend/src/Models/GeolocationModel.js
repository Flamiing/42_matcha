// Local Imports:
import Model from '../Core/Model.js';

class GeolocationModel extends Model {
    constructor() {
        super('geolocation');
    }

    async update(location, id) {
        const values = [
            id,
            location.latitude,
            location.longitude
        ]

        const query = {
            text: `INSERT INTO ${this.table} (id, latitude, longitude)
            VALUES ($1, $2, $3)
            ON CONFLICT (id) DO UPDATE
            SET latitude = $2, longitude = $3
            RETURNING *;`,
            values: values,
        };

        try {
            const result = await this.db.query(query);
            if (result.rows.length === 0) return [];
            return result.rows[0];
        } catch (error) {
            console.error('Error making the query: ', error.message);
            return null;
        }
    }
}

const geolocationModel = new GeolocationModel();
export default geolocationModel;
