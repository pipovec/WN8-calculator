import React, {Component} from 'react'
import NativeSelect from '@mui/material/NativeSelect'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'

class Calculator extends Component {
  constructor(props) {
    super(props);
    this.state = {type: '', level: '', tank_id: '', tanks: ''}
    this.handleType = this.handleType.bind(this)
    this.handleLevel = this.handleLevel.bind(this)
    this.handleTank = this.handleTank.bind(this)
    // this.Data = this.Data.bind(this)
    this.SendRequest = this.SendRequest.bind(this)
  }
  componentDidMount() {
    this.SendRequest('10', 'mediumTank');
    this.setState({type: 'mediumTank', level: '10', tank_id: '0'})
  }
  async SendRequest(level, type) {
    const urlApi = process.env.REACT_APP_API_URL + '/api/encyclopedia_vehicles';
    const params = {'level': level, 'type': type};

    let url = new URL(urlApi);
    url.search = new URLSearchParams(params).toString();

    await fetch(url, {
      headers: {Accept: 'application/json'},
    })
      .then(response => {
        return response.json()
      })
      .then(json => {
        this.setState({tanks: json})
      })
  }
  handleType(e) {
    this.setState({select: e.target.value})
    this.SendRequest(this.state.level, e.target.value)
  }
  handleLevel(e) {
    this.setState({level: e.target.value});
    this.SendRequest(e.target.value, this.state.type)
  }
  handleTank(e) {
    this.setState({tank_id: e.target.value})
    this.props.onFindTankId(e.target.value)

    for (var value in this.state.tanks) {
      if (this.state.tanks[value].tank_id === parseInt(e.target.value, 10))
        this.props.onFindTankPicture(this.state.tanks[value].big_icon)
    }
  }
  render() {
    var Tanks = <option key='' value=''> Loading data ... </option>

    if (this.state.tanks.length > 0) {
      Tanks = this.state.tanks.map((tank) =>
        <option key={tank.tank_id} value={tank.tank_id}>{tank.name}</option>
      )
    }

    return (
      <div className="w3-row-padding w3-padding">
        {/* Vyber level tankov */}
        <div className="w3-third">
          <FormControl fullWidth={true} margin='dense' variant='outlined'>
            <InputLabel shrink>
              Level
            </InputLabel>
            <NativeSelect
              onChange={this.handleLevel}
              name='Level'
              defaultValue={10}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </NativeSelect>
          </FormControl>
        </div>

        {/* Vyber typy tankov */}
        <div className="w3-third">
          <FormControl fullWidth={true} margin='dense' variant='outlined'>
            <InputLabel shrink>
              Type
            </InputLabel>
            <NativeSelect onChange={this.handleType}>
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
          <FormControl fullWidth={true} margin='dense' variant='outlined'>
            <InputLabel shrink>
              Tank
            </InputLabel>
            <NativeSelect
              onChange={this.handleTank}
            >
              <option defaultValue="0">Choose your tank</option>
              {Tanks}
            </NativeSelect>
          </FormControl>
        </div>
      </div>
    );
  }
}

export default Calculator;
