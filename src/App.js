import React, { Component } from 'react'
import Calculator from './Calculator'
import Picture from './Picture'
import Result from './Result'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {tanks: '', etvdata: false, tank_id: '',etv_tank: '', tankPicture_url: '', pictureHeight : { minHeight: "116x"}}
    this.GetETVtable = this.GetETVtable.bind(this)
    this.GetETVtable()
    
    this.handleTankId = this.handleTankId.bind(this)
    this.handleETVTank = this.handleETVTank.bind(this)
    this.handleTankPicture = this.handleTankPicture.bind(this)
  }


  async GetETVtable () {
    await fetch('http://api.fpcstat.cz/expected-value')
        .then(response => {
          return response.json();
        }).then( json => {
          this.setState({etvdata: json['0']})
        });
  }

  handleTankId(id)  {
    this.setState({tank_id: id});
  }

  handleTankPicture(tank) {        
    this.setState({tankPicture_url: tank})
  }

  handleETVTank(data) {
    this.setState({etv_tank: data});
  }

  render() { 
    let url
    let version   

    if (this.state.etvdata)
    {     
     version = this.state.etvdata.header.version
     url = this.state.etvdata.header.url
    }

    return (
      <div className="w3-container w3-center">
          <h1>WN8 online calculator</h1>
          <p>I am using Expected Tank Values from server 
            <a href={url}> modxvm.com</a> version {version}
          </p>                
        <div className="w3-row-padding">
          <div className="col-sm-6 w3-card w3-margin-bottom ">
            <Calculator
                tanks={this.state.tanks}
                etv={this.state.etvdata}
                onFindTankId={this.handleTankId}
                onFindETV={this.handleETVTank}
                onFindTankPicture={ this.handleTankPicture }
            />
          </div>
          
          <div className="w3-rowpadding w3-card w3-margin-bottom">
              <div className="w3-container w3-padding">
                <Picture
                    picture_url={this.state.tankPicture_url}
                />
            </div>
          
          <div className="w3-row-padding w3-card w3-padding">
                <Result
                    etv_tank={this.state.etvdata}
                    id={this.state.tank_id}
                />
          </div>
        </div>
      </div>
      <p>the source code is freely available on <a href="https://github.com/pipovec/WN8-calculator">Github</a></p>
      </div>
    );
  }
}

export default App;
