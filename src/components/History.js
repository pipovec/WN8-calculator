import React, {Component} from 'react';
import LineChart from "./Chart";

class History extends Component {
    constructor(props) {
        super(props);
        this.state = {
            historyData: undefined,
            frags: [5,4,3,2,1],
            dmg: [1882.726,1882.858],
            spot: [5,4,3,2,1],
            def: [5,4,3,2,1],
            win: [5,4,3,2,1],
            date: "",
            tank_id: this.props.tank_id,
        };

        this.getHistoryData = this.getHistoryData.bind(this);
        this.getHistoryData(this.props.tank_id);
        this.setCharData = this.setCharData.bind(this);
    }

    componentDidUpdate(prevProps: Readonly<P>) {
        if(prevProps.tank_id !== this.props.tank_id)
        {
            this.getHistoryData(this.props.tank_id);
        }
    }

    async getHistoryData(tank_id) {
        await fetch(process.env.REACT_APP_API_URL + '/expected-value-history/' + tank_id)
            .then(response => {
                return response.json();
            })
            .then(json => {
                this.setState({historyData: json});
                this.setCharData();
            })
    }

    setCharData() {
        let dataFrags = this.state.historyData.map(element => element.frag);
        let dataDmg = this.state.historyData.map(element => element.dmg);
        let dataSpot = this.state.historyData.map(element => element.spot);
        let dataDef = this.state.historyData.map(element => element.def);
        let dataWin = this.state.historyData.map(element => element.win);
        let dataDate = this.state.historyData.map(element => element.date);

        this.setState({
            frags: dataFrags,
            dmg: dataDmg,
            spot: dataSpot,
            def: dataDef,
            win: dataWin,
            date: dataDate,
        });
    }

    render() {
        return (
            <div>
                <div className="w3-row">
                    <div className="w3-col l6 m12">
                        <LineChart data={this.state.frags} name='Frags history' date={this.state.date}/>
                    </div>
                    <div className="w3-col l6 m12">
                        <LineChart data={this.state.dmg} name='Damage history' date={this.state.date}/>
                    </div>
                    <div className="w3-col l6 m12">
                        <LineChart data={this.state.spot} name='Spot history' date={this.state.date}/>
                    </div>
                    <div className="w3-col l6 m12">
                        <LineChart data={this.state.def} name='Def history' date={this.state.date}/>
                    </div>
                    <div className="w3-col l6 m12">
                        <LineChart data={this.state.win} name='Win history' date={this.state.date}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default History;