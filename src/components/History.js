import React, {Component} from 'react';
import LineChart from "./Chart";

class History extends Component {
    constructor(props) {
        super(props);
        this.state = {
            historyData: undefined,
            frags: [{}],
            dmg: [{}],
            spot: [],
            def: [],
            win: [],            
        };

        this.getHistoryData = this.getHistoryData.bind(this);
        this.getHistoryData(this.props.tankId);
        this.setCharData = this.setCharData.bind(this);
    }

    componentDidUpdate(prevProps) {
        if(prevProps.tankId !== this.props.tankId) {
            this.getHistoryData();
        }
    }

    async getHistoryData() {
        await fetch('https://api.fpcstat.cz/expected-value-history-two-weeks/' + this.props.tankId)
            .then(response => {
                return response.json();
            })
            .then(json => {
                this.setState({historyData: json.data});
                this.setCharData();
            })
    }

    setCharData() {
        let dataFrags = this.state.historyData.map(element => ({
            y: element.frag,
            x: element.date.date
        }));
        let dataDmg = this.state.historyData.map(element => ({
            y: element.dmg,
            x: element.date.date
        }));
        let dataSpot = this.state.historyData.map(element =>({
            y: element.spot,
            x: element.date.date
        }));
        let dataDef = this.state.historyData.map(element => ({
            y: element.def,
            x: element.date.date
        }));
        let dataWin = this.state.historyData.map(element => ({
            y: element.win,
            x: element.date.date
        }));



        this.setState({
            frags: dataFrags,
            dmg: dataDmg,
            spot: dataSpot,
            def: dataDef,
            win: dataWin,
        });
    }

    render() {
        return (
            <div>
                <div className="w3-row">
                    <div className="w3-col l6 m12">
                        <LineChart data={this.state.frags} name='Frags history' />
                    </div>
                    <div className="w3-col l6 m12">
                        <LineChart data={this.state.dmg} name='Damage history' />
                    </div>
                    <div className="w3-col l6 m12">
                        <LineChart data={this.state.spot} name='Spot history' />
                    </div>
                    <div className="w3-col l6 m12">
                        <LineChart data={this.state.def} name='Def history' />
                    </div>
                    <div className="w3-col l6 m12">
                        <LineChart data={this.state.win} name='Win history' />
                    </div>
                    <div className="w3-col l6 m12 w3-center">                        
                        <a href={"https://etvh.fpcstat.cz"}>More data range for ETV</a>
                    </div>
                </div>
            </div>
        );
    }
}

export default History;