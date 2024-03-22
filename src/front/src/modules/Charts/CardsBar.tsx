import {Chart, registerables} from "chart.js";
import {Bar} from "react-chartjs-2";
import React from "react";
import {CardInterface} from "../../../../models/card.interface";

export const CardsBar = (props: any) => {
    Chart.register(...registerables);

    const handleData = (data: CardInterface[]) => {
        if (data && data.length) {
            return {
                datasets: [{
                    label: 'Deck repartition',
                    data: data.map(card => card?.quantity),
                }],
                labels: data.map(card => card?.name)
            }
        } else {
            return {
                datasets: [],
                labels: []
            };
        }

    }

    if (props.data) {
        return (
            <div className="App">
                <Bar data={handleData(props.data)}></Bar>
            </div>
        )
    } else {
        return (<></>);
    }
}