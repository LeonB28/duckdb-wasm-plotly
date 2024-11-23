import 'https://cdn.plot.ly/plotly-2.26.0.min.js';
import {DAO} from "./dao.js";


export async function getData(selectColumn) {
    let res = await DAO.getDataPerCountry([selectColumn]);
    let layout = {
        title: selectColumn,
        xaxis: {
            title: 'Province_State'
        },
        yaxis: {
            title: selectColumn
        }
    };


    let data = [
        {
            x: res.map(x => x['Province_State']),
            y: res.map(x => x[selectColumn]),
            type: 'bar',
        }
    ]

    Plotly.newPlot('data', data, layout);
}