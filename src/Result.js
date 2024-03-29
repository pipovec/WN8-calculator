import React, {Component} from 'react';
import History from './components/History';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import {wn8color} from 'wn8-color';

class Result extends Component {
  constructor(props) {
    super(props);
    this.Data = this.Data.bind(this)
    this.handleYFrag = this.handleYFrag.bind(this)
    this.handleYDmg = this.handleYDmg.bind(this)
    this.handleYSpot = this.handleYSpot.bind(this)
    this.handleYDef = this.handleYDef.bind(this)
    this.handleYWin = this.handleYWin.bind(this)
    this.clickAvgValue = this.clickAvgValue.bind(this)
    this.handleSwitchDevelop = this.handleSwitchDevelop.bind(this)
    this.handleSwitchHistory = this.handleSwitchHistory.bind(this)

    this.state = {
      yDmg: 0.00,
      ySpot: 0.00,
      yFrag: 0.00,
      yDef: 0.00,
      yWin: 0.00,
      developerMode: false,
      historyMode: false,
      tankEtvData: {},
      htmlDevelopMode: '',
      htmlHistoryMode: '',
      wn8value: 0.00,
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.tank_id !== this.props.tank_id) {
      this.Data();
    }
  }

  async Data() {
    if (this.props.tank_id !== 0) {
      const apiURL = process.env.REACT_APP_API_URL + '/api/expected_tank_values/' + this.props.tank_id;

      await fetch(apiURL, {
        headers: {'Accept': 'application/json'}
      }).then(response => {
        return response.json();
      }).then(json => {
        this.setState({tankEtvData: json})
      });
    }
  }

  clickAvgValue() {
    this.setState({
      yFrag: this.state.tankEtvData.frag,
      yDmg: this.state.tankEtvData.dmg,
      ySpot: this.state.tankEtvData.spot,
      yDef: this.state.tankEtvData.def,
      yWin: this.state.tankEtvData.win,

    })
    this.forceUpdate();
  }

  handleYFrag(e) {
    this.setState({yFrag: e.target.value, clickKill: e.target.value})
  }

  handleYDmg(e) {
    this.setState({yDmg: e.target.value, clickDmg: e.target.value})
  }

  handleYSpot(e) {
    this.setState({ySpot: e.target.value, clickSpot: e.target.value})
  }

  handleYDef(e) {
    this.setState({yDef: e.target.value, clickDef: e.target.value})
  }

  handleYWin(e) {
    this.setState({yWin: e.target.value, clickWin: e.target.value})
  }

  returnStep1(expValue, yValue) {
    var result = yValue / expValue;
    result = result.toFixed(4);

    if (isNaN(result)) {
      result = 0.0
    }

    return result;
  }

  returnrFRAGc(expValue, yValue, rDMGc) {
    var rFRAG = yValue / expValue;
    rDMGc = parseFloat(rDMGc);

    var rFRAGc = Math.max(0, Math.min(rDMGc + 0.2, (rFRAG - 0.12) / (1 - 0.12)));

    if (isNaN(rFRAGc)) {
      rFRAGc = 0.0
    }

    rFRAGc = rFRAGc.toFixed(4);

    return rFRAGc;
  }

  returnrDMGc(expValue, yValue) {
    var rDMG = yValue / expValue;
    var rDAMAGEc = Math.max(0, (rDMG - 0.22) / (1 - 0.22));

    if (isNaN(rDAMAGEc)) {
      rDAMAGEc = 0.0
    }
    return rDAMAGEc.toFixed(4);
  }

  returnrWINc(expValue, yValue) {
    var rWIN = yValue / expValue;
    rWIN = parseFloat(rWIN);
    var rWINc = Math.max(0, (rWIN - 0.71) / (1 - 0.71));

    if (isNaN(rWINc)) {
      rWINc = 0.0
    }

    return rWINc.toFixed(4);
  }

  returnrSPOTc(expValue, yValue, rDMGc) {
    rDMGc = parseFloat(rDMGc);
    var rSPOT = yValue / expValue;
    var rSPOTc = Math.max(0, Math.min(rDMGc + 0.1, (rSPOT - 0.38) / (1 - 0.38)));

    if (isNaN(rSPOTc)) {
      rSPOTc = 0.0
    }

    return rSPOTc.toFixed(4);
  }

  returnrDEFc(expValue, yValue, rDMGc) {
    rDMGc = parseFloat(rDMGc);
    var rDEF = yValue / expValue;
    var rDEFc = Math.max(0, Math.min(rDMGc + 0.1, (rDEF - 0.10) / (1 - 0.10)));

    if (isNaN(rDEFc)) {
      rDEFc = 0.0
    }

    return rDEFc.toFixed(4);
  }

  handleSwitchHistory() {
    this.setState({historyMode: !this.state.historyMode});
  }

  handleSwitchDevelop() {
    this.setState({developerMode: !this.state.developerMode})
  }

  wn8style(WN8) {
    var color = 'grey';

    color = wn8color(WN8);

    var WN8Style = {
      background: color,
    }

    return WN8Style;
  }

  render() {
    var rDMGc = this.returnrDMGc(this.state.tankEtvData.dmg, this.state.yDmg);
    var rFragc = this.returnrFRAGc(this.state.tankEtvData.frag, this.state.yFrag, rDMGc);
    var rWinc = this.returnrWINc(this.state.tankEtvData.win, this.state.yWin);
    var rSpotc = this.returnrSPOTc(this.state.tankEtvData.spot, this.state.ySpot, rDMGc);
    var rDefc = this.returnrDEFc(this.state.tankEtvData.def, this.state.yDef, rDMGc);

    var WN8 = (980 * rDMGc) + (210 * rDMGc * rFragc) + (155 * rFragc * rSpotc) + (75 * rDefc * rFragc) + (145 * Math.min(1.8, rWinc));
    WN8 = WN8.toFixed(2);

    let historyMode;

    // HISTORY MOD
    if (this.state.historyMode && this.props.tank_id > 0) {
      historyMode = <History tankId={this.props.tank_id}></History>
    } else {
      historyMode = '';
    }

    // HISTORY MOD
    let developerMode;
    if (this.state.developerMode && this.props.tank_id > 0) {
      developerMode = <table className="w3-table w3-border w3-centered w3-bordered w3-margin-top">
        <thead className="w3-tiny">
        <tr>
          <th className="text-center">expFrag</th>
          <th className="text-center">expDMG</th>
          <th className="text-center">expSpot</th>
          <th className="text-center">expDef</th>
          <th className="text-center">expWin</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>{this.state.tankEtvData.frag}</td>
          <td>{this.state.tankEtvData.dmg}</td>
          <td>{this.state.tankEtvData.spot}</td>
          <td>{this.state.tankEtvData.def}</td>
          <td>{this.state.tankEtvData.win}</td>
        </tr>
        </tbody>
        <thead className="w3-tiny">
        <tr>
          <th className="text-center">rFrag</th>
          <th className="text-center">rDMG</th>
          <th className="text-center">rSpot</th>
          <th className="text-center">rDef</th>
          <th className="text-center">rWin</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>{this.returnStep1(this.state.tankEtvData.frag, this.state.yFrag)}</td>
          <td>{this.returnStep1(this.state.tankEtvData.dmg, this.state.yDmg)}</td>
          <td>{this.returnStep1(this.state.tankEtvData.spot, this.state.ySpot)}</td>
          <td>{this.returnStep1(this.state.tankEtvData.def, this.state.yDef)}</td>
          <td>{this.returnStep1(this.state.tankEtvData.win, this.state.yWin)}</td>
        </tr>
        </tbody>
        <thead className="w3-tiny">
        <tr>
          <th className="text-center">rFragc</th>
          <th className="text-center">rDamagec</th>
          <th className="text-center">rSpotc</th>
          <th className="text-center">rDefc</th>
          <th className="text-center">rWinc</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>{rFragc}</td>
          <td>{rDMGc}</td>
          <td>{rSpotc}</td>
          <td>{rDefc}</td>
          <td>{rWinc}</td>
        </tr>
        </tbody>
      </table>
    } else {
      developerMode = '';
    }
    return (
      <div>
        <div className="w3-cell-row">
          <div className="w3-padding w3-cell w3-mobile">
            <TextField
              onChange={this.handleYFrag} value={this.state.yFrag}
              id="outlined-simple-start-adornment"
              variant="outlined"
              label="Frags /Kills/ "

            />
          </div>
          <div className="w3-padding w3-cell w3-mobile">
            <TextField
              onChange={this.handleYDmg} value={this.state.yDmg}
              id="outlined-simple-start-adornment"
              variant="outlined"
              label="Damage dealt"
            />
          </div>
          <div className="w3-padding w3-cell w3-mobile">
            <TextField
              onChange={this.handleYSpot} value={this.state.ySpot}
              id="outlined-simple-start-adornment"
              variant="outlined"
              label="Enemies spotted"
            />
          </div>
          <div className="w3-padding w3-cell w3-mobile">
            <TextField
              onChange={this.handleYDef} value={this.state.yDef}
              id="outlined-simple-start-adornment"
              variant="outlined"
              label="Dropped capture points"
            />
          </div>
          <div className="w3-padding w3-cell w3-mobile">
            <TextField
              onChange={this.handleYWin} value={this.state.yWin}
              id="outlined-simple-start-adornment"
              variant="outlined"
              label="Winrate"
            />
          </div>
        </div>
        <Divider variant="fullWidth" component="hr"/>
        <div className="w3-padding">
          <FormGroup row>
            <FormControlLabel
              control={
                <Switch
                  checked={this.state.developerMode}
                  disabled={!this.state.historyMode && this.props.tank_id !== 0 ? false : true}
                  onChange={this.handleSwitchDevelop}
                />
              }
              label="Developer mode"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={this.state.historyMode}
                  disabled={!this.state.developerMode && this.props.tank_id !== 0 ? false : true}
                  onChange={this.handleSwitchHistory}
                />
              }
              label="History"
            />
            <Button variant="contained" onClick={this.clickAvgValue}>Load average value</Button>
          </FormGroup>
        </div>
        <Divider variant="fullWidth" component="hr"/>
        {developerMode}
        {historyMode}
        <div className="w3-row w3-margin-top" style={this.wn8style(WN8)}>
          <div className="w3-center">
            <h2 style={{color: "white"}}><strong>{WN8}</strong></h2>
          </div>
        </div>
      </div>
    );
  }
}
export default Result;
