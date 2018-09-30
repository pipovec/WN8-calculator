import React, { Component } from 'react';

class Calculator extends Component {
  constructor(props) {
    super(props);
    this.state = {type: 'mediumTank',level: '10',tank_id: '0',};
    this.handleType = this.handleType.bind(this);
    this.handleLevel = this.handleLevel.bind(this);
    this.handleTank = this.handleTank.bind(this);
    this.Data = this.Data.bind(this);
  }

  Data() {
    var data = this.props.etv.data;
    var dat = [];
    for(const prop in data)  {
      if( parseInt(data[prop].IDNum,10) === parseInt(this.state.tank_id,10)) {

        dat[0]  = parseFloat(data[prop].expDamage);
        dat[1]  = parseFloat(data[prop].expDef);
        dat[2]  = parseFloat(data[prop].expFrag);
        dat[3]  = parseFloat(data[prop].expSpot);
        dat[4]  = parseFloat(data[prop].expWinRate);

      }

    }
    return dat;
  }


handleType(e) {
  this.setState({select: e.target.value});
}

handleLevel(e) {
  this.setState({level: e.target.value});
}

handleTank(e) {
  var t = this.Data();
  this.setState({tank_id: e.target.value});
  this.props.onFindTankId(e.target.value);
  this.props.onFindETV(t);


}

  render() {

  var Tanks = [];
  const levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const LevelsItem = levels.map((levels)=>
    <option key={levels} value={levels}> {levels} </option>
  );

    let c = this.props.tanks.data;
    let i = 0;

    for(const prop in c)     {
        if(c[prop].type === this.state.select) {
            if(parseInt(c[prop].tier,10) === parseInt(this.state.level,10))  {
            Tanks[i]=<option key={c[prop].tank_id} value={c[prop].tank_id}> {c[prop].short_name} </option>;
            i++;
          }
        }
    }

    return (
      <div className="w3-row-padding">

            {/* Vyber level tankov */}
            <div class="w3-third">
            <label for="level">Level</label>
            <select  value={this.state.level} onChange={this.handleLevel} type="number" className="w3-select" id="level">
              {LevelsItem}
            </select>
            </div>

            {/* Vyber typy tankov */}
            <div class="w3-third">
            <label for="kind">Type of tank</label>
            <select  value={this.state.select} onChange={this.handleType} className="w3-select" id="kind">
              <option value="mediumTank">mediumTank</option>
              <option value="heavyTank">heavyTank</option>
              <option value="lightTank">lightTank</option>
              <option value="AT-SPG">TD</option>
              <option value="SPG">SPG</option>
            </select>
            </div>

            {/* Vyber konkretneho tanku */}
            <div class="w3-third">
            <label for="tank">Tank</label>
              <select  value={this.state.tank_id} onChange={this.handleTank} className="w3-select" input="tank">
                {Tanks}
                </select>
            </div>
      </div>


    );
  }


}

export default Calculator;
