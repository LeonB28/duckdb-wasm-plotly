import { db } from './db.js';

export class DAO {
    static async getData(columns) {
        let renamedColumns = columns.map((currElement, index) => `"${currElement}" as value_${index}`);
        let renamedColumnsMax = columns.map((currElement, index) => `max(value_${index}) as '${currElement}'`);
        let selectedColumns = renamedColumns.join(',');
        let groupByText = renamedColumnsMax.join(',');

        const conn = await db.connect();
        let query = `
            with renamed as (
                SELECT
                    "Reporting Year" as year,
                    ${selectedColumns}
                FROM read_parquet('oil.parquet')
            )
            SELECT
                ltrim(year,'n') as "Reporting Year",
                ${groupByText}
            FROM renamed
            GROUP BY
                year
            ORDER BY year
            `
        const res = await conn.query(query);
        return res.toArray();
    }
}