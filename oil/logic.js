import 'https://cdn.plot.ly/plotly-2.26.0.min.js';
import {DAO} from "./dao.js";

export async function loadDataScatter(columns) {
     let res = await DAO.getData(columns);
     let years = res.map(x => x['Reporting Year']);
     var data = columns.map(col => {
        let values = res.map(x => x[col]);
        return {
            x: years,
            y: values,
            mode: 'markers',
            type: 'scatter',
            name: col,
            text: years,
            marker: { size: 12 }
        }
     })
    Plotly.newPlot('data', data);
}