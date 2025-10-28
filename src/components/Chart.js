import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import Box from '@mui/material/Box';

const LineChart = ({ name, data }) => {
    const [series, setSeries] = useState([{ name, data }]);

    useEffect(() => {
        setSeries([{ name, data }]);
    }, [name, data]);

    const options = {
        chart: {
            id: name,
            type: 'line',
            zoom: {
                type: 'x',
                enabled: true,
                autoScaleYaxis: true,
            },
            toolbar: {
                autoSelected: 'zoom',
            },
            fontFamily: 'Roboto, sans-serif',
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            width: 3,
            curve: 'smooth',
        },
        title: {
            text: name,
            align: 'left',
            style: {
                fontSize: '16px',
                fontWeight: 600,
                color: '#263238',
            },
        },
        markers: {
            size: 0,
            hover: {
                size: 6,
            },
        },
        xaxis: {
            type: 'datetime',
            labels: {
                style: {
                    colors: '#546e7a',
                },
            },
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#546e7a',
                },
            },
        },
        grid: {
            borderColor: '#e0e0e0',
            strokeDashArray: 5,
        },
        colors: ['#1976d2'],
        tooltip: {
            theme: 'light',
        },
    };

    return (
        <Box sx={{ width: '100%', py: 2 }}>
            <Chart
                options={options}
                series={series}
                type="line"
                height="200px"
                width="100%"
            />
        </Box>
    );
};

export default LineChart;