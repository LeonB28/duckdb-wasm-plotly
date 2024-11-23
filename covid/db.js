const duckdb = await import("https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@1.28/+esm");
import * as arrow from 'https://cdn.jsdelivr.net/npm/apache-arrow@16.1.0/+esm';
const DuckDBDataProtocol = duckdb.DuckDBDataProtocol
const bundles = duckdb.getJsDelivrBundles();
const bundle = await duckdb.selectBundle(bundles);


// Function to create and initialize the DuckDB database.
async function makeDB() {
    const logger = new duckdb.ConsoleLogger("error");
    const worker = await duckdb.createWorker(bundle.mainWorker);
    const db = new duckdb.AsyncDuckDB(logger, worker);
    await db.instantiate(bundle.mainModule);
    return db
}

// Creating the DuckDB database instance.
const db = await makeDB();

//just an example
async function createCovidTable() {
    const conn = await db.connect();

    await db.registerFileURL(
        `data.csv`,
        'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports_us/02-14-2022.csv',
        DuckDBDataProtocol.HTTP
    );

    await conn.insertCSVFromPath('data.csv', {
        schema: 'main',
        name: 'daily_reports_us',
        detect: false,
        header: true,
        delimiter: ',',
        columns: {
            Province_State: new arrow.Utf8(),
            Country_Region: new arrow.Utf8(),
            Last_Update: new arrow.Utf8(),
            Lat: new arrow.Float32(),
            Long_: new arrow.Float32(),
            Confirmed: new arrow.Int32(),
            Deaths: new arrow.Int32(),
            Recovered: new arrow.Int32(),
            Active: new arrow.Int32(),
            FIPS: new arrow.Int32(),
            Incident_Rate: new arrow.Float32(),
            Total_Test_Results: new arrow.Int32(),
            People_Hospitalized: new arrow.Int32(),
            Case_Fatality_Ratio: new arrow.Float32(),
            UID: new arrow.Int32(),
            ISO3: new arrow.Utf8(),
            Testing_Rate: new arrow.Float32(),
            Hospitalization_Rate: new arrow.Float32(),
            Date: new arrow.Utf8(),
            People_Tested: new arrow.Int32(),
            Mortality_Rate: new arrow.Float32(),
        }
    });
}

await createCovidTable();

export { db };