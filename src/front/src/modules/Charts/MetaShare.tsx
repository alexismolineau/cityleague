import {Pie} from "react-chartjs-2";
import React from "react";
import {Chart, registerables} from "chart.js";
import {ArchetypeInterface} from "../../../../models/archetype.interface";

export const MetaShare = (props: any) => {

    Chart.register(...registerables);

    const handleData = (data: ArchetypeInterface[]) => {
        if (data && data.length) {
            return {
                datasets: [{
                    data: data.map(archetype => archetype?.qty),
                }],
                labels: data.map(archetype => archetype?.name)
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
                <Pie data={handleData(props.data)}></Pie>
            </div>
        )
    } else {
        return (<></>);
    }
}