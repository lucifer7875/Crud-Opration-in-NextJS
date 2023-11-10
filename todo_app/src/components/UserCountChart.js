import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function UserCountChart({ data }) {
    const { labels, data: userData } = data;

    const canvasEl = useRef(null);

    const colors = {
        purple: {
            default: "rgba(90,200,250, 0.7)",
            half: "rgba(90,200,250, 0.5)",
            quarter: "rgba(90,200,250, 0.25)",
            zero: "rgba(90,200,250, 0)"
        },
        indigo: {
            default: "rgba(80, 102, 120, 1)",
            quarter: "rgba(80, 102, 120, 0.25)"
        }
    };

    useEffect(() => {
        const ctx = canvasEl.current.getContext("2d");
        // const ctx = document.getElementById("myChart");

        const backgroundColor = [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb(255, 102, 102)',
            'rgb(128, 255, 0)',
            'rgb(153, 51, 255)',
            'rgb(255, 128, 0)',
        ]
        // const gradient = ctx.createLinearGradient(78, 235, 16, 0.62);
        // gradient.addColorStop(0, colors.purple.half);
        // gradient.addColorStop(0.65, colors.purple.quarter);
        // gradient.addColorStop(1, colors.purple.zero);

        const counts = userData;


        const data = {
            labels: labels,
            datasets: [
                {
                    backgroundColor: backgroundColor,
                    label: "Created User",
                    data: counts,
                    fill: true,
                    borderWidth: 2,
                    borderColor: colors.purple.default,
                    lineTension: 0.2,
                    pointBackgroundColor: colors.purple.default,
                    pointRadius: 3
                }
            ]
        };
        const config = {
            type: "doughnut",
            data: data
        };
        const myLineChart = new Chart(ctx, config);

        return function cleanup() {
            myLineChart.destroy();
        };
    });

    return (
        <div className="App ">
            <div className="chart">

                <canvas id="myChart" ref={canvasEl} style={{ width: '849px' }} />
            </div>
            {/* <canvas id="myChart" ref={canvasEl} height="50" width='50' /> */}
        </div>
    );
}
