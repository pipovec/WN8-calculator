import React, { Component } from "react";
import Chart from "react-apexcharts";

class LineChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options: {
                chart: {
                    id: this.props.name,
                    type: "line"
                },
                stroke: {
                    widths: 1,
                    curve: 'straight'
                },
            },
            series: [
                {
                    name: this.props.name,
                    data: this.props.data,
                }
            ]
        }
    }

    render() {

        return (
            <Chart
                title={this.props.name}
                options={this.state.options}
                series={this.state.series}
                type="line"
                height="150px"
                width="100%"

            />
        );
    }
}
export default LineChart;