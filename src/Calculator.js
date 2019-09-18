import React, { Component } from 'react';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles, withStyles } from '@material-ui/core/styles';



class Calculator extends Component {
  constructor(props) {
    super(props);
    this.state = {type: '', level: '', tank_id: '', tanks: ''}
    this.handleType = this.handleType.bind(this)
    this.handleLevel = this.handleLevel.bind(this)
    this.handleTank = this.handleTank.bind(this)
    this.Data = this.Data.bind(this)
    this.SendRequest = this.SendRequest.bind(this)
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

componentDidMount() {
  this.SendRequest('10','mediumTank');
  this.setState({type: 'mediumTank', level: '10', tank_id: '0'})
}


SendRequest(level, type) {
  var url = 'https://fpcstat.cz/api/vehicles/level/'+level+'/type/'+type

  fetch(url)
  .then( response => {
    return response.json()
  })
  .then( json => {    
    this.setState({tanks: json.data})    
  })

}

handleType(e) {
  this.setState({select: e.target.value})
  this.SendRequest(this.state.level,e.target.value)
}

handleLevel(e) {
  this.setState({level: e.target.value});  
  this.SendRequest(e.target.value,this.state.type)
}

handleTank(e) {
  var t = this.Data();
  this.setState({tank_id: e.target.value})
  this.props.onFindTankId(e.target.value)
  
  for(var value in this.state.tanks) {
    if(this.state.tanks[value].tank_id === parseInt(e.target.value,10))
    this.props.onFindTankPicture( this.state.tanks[value].big_icon )  
  }
  
  this.props.onFindETV(t)
}




  render() {

    const levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    var Tanks = <option key='' value=''> Loading data ... </option>
    

    if(this.state.tanks.length > 0)
    {
      Tanks = this.state.tanks.map( (tank) => 
        <option key={tank.tank_id} value={tank.tank_id}>{tank.name}</option>        
      )
    }    
    
    return (
      <div className="w3-row-padding w3-padding">

            {/* Vyber level tankov */}
            <div className="w3-third">
              <FormControl fullWidth='true'>
                <InputLabel shrink>
                    Level
                </InputLabel>
                  <NativeSelect
                    onChange={this.handleLevel}
                    name='Level'
                    inputProps={{
                      id: 'select-native',
                      'aria-label':'Level'                 
                    }}
                    >
                    {levels.map(name => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </NativeSelect>
                </FormControl>
            </div>

            {/* Vyber typy tankov */}
            <div className="w3-third">
              <FormControl fullWidth='true'>
                <InputLabel shrink>
                  Type
                </InputLabel>
                <NativeSelect onChange={this.handleType} >
                  <option value="mediumTank">mediumTank</option>
                  <option value="heavyTank">heavyTank</option>
                  <option value="lightTank">lightTank</option>
                  <option value="AT-SPG">TD</option>
                  <option value="SPG">SPG</option>
                </NativeSelect>              
              </FormControl>             
            </div>

            {/* Vyber konkretneho tanku */}
            <div className="w3-third">
              <FormControl fullWidth='true'>
                <InputLabel shrink>
                  Tank
                </InputLabel>
              </FormControl>
              <NativeSelect onChange={this.handleTank}>
                <option defaultValue="0" >Choose your tank</option>
                {Tanks}
              </NativeSelect>
            </div>
      </div>

    );
  }


}

export default Calculator;
