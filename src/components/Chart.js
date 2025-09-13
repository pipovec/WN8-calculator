import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

const LineChart = ({ name, data }) => {
    const [series, setSeries] = useState([{ name, data }]);

    useEffect(() => {
        setSeries([{ name, data }]);
    }, [name, data]);

    const options = {
        chart: {
            id: name,
            type: "line",
            zoom: {
                type: "x",
                enabled: true,
                autoScaleYaxis: true,
            },
            toolbar: {
                autoSelected: "zoom",
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            width: 1,
            curve: "straight",
        },
        title: {
            text: name,
        },
        markers: {
            size: 1,
        },
        xaxis: {
            type: "datetime",
        },
    };

    return (
        <Chart
            options={options}
            series={series}
            type="line"
            height="150px"
            width="100%"
        />
    );
};

export default LineChart;
