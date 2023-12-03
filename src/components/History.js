import React, {Component} from 'react';
import LineChart from "./Chart";
import moment from 'moment';

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
    this.getHistoryData();
    this.setCharData = this.setCharData.bind(this);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.tankId !== this.props.tankId) {
      this.getHistoryData();
    }
  }
  async getHistoryData() {
    var date = moment().day(-14).format('YYYY-MM-DD');

    var urlApi = new URL(process.env.REACT_APP_API_URL + '/api/expected_tank_value_histories');
    var params = {
      'tank_id': this.props.tankId,
      'date[after]': date,
      'order[date]': 'DESC',
    };

    urlApi.search = new URLSearchParams(params).toString();

    await fetch(urlApi, {
      headers: {Accept: 'application/json'},
    })
      .then(response => {
        return response.json();
      })
      .then(json => {
        this.setState({historyData: json});
        this.setCharData();
      })
  }
  setCharData() {
    let dataFrags = this.state.historyData.map(element => ({
      y: element.frag,
      x: element.date
    }));
    let dataDmg = this.state.historyData.map(element => ({
      y: element.dmg,
      x: element.date
    }));
    let dataSpot = this.state.historyData.map(element => ({
      y: element.spot,
      x: element.date
    }));
    let dataDef = this.state.historyData.map(element => ({
      y: element.def,
      x: element.date
    }));
    let dataWin = this.state.historyData.map(element => ({
      y: element.win,
      x: element.date
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
            <LineChart data={this.state.frags} name='Frags history'/>
          </div>
          <div className="w3-col l6 m12">
            <LineChart data={this.state.dmg} name='Damage history'/>
          </div>
          <div className="w3-col l6 m12">
            <LineChart data={this.state.spot} name='Spot history'/>
          </div>
          <div className="w3-col l6 m12">
            <LineChart data={this.state.def} name='Def history'/>
          </div>
          <div className="w3-col l6 m12">
            <LineChart data={this.state.win} name='Win history'/>
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
