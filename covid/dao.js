import { db } from './db.js';

export class DAO {
    static async getDataPerCountry(columns) {
        const conn = await db.connect();
        const columnsToSelect = columns.join(', ');
        const sql = `
            SELECT 
                Province_State, ${columnsToSelect}
            FROM daily_reports_us
            ORDER BY Province_State
        `;
        const res = await conn.query(sql);
        return res.toArray();
    }
}