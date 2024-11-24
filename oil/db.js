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


async function createOilTable() {
    await db.registerFileURL(
        "oil.parquet",
        'https://raw.githubusercontent.com/plotly/datasets/master/oil-and-gas.parquet',
        DuckDBDataProtocol.HTTP
    );

}

await createOilTable();

export { db };