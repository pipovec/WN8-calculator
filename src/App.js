import React, { Component } from 'react';
import './w3.css';
import Calculator from './Calculator';
import Picture from './Picture';
import Result from './Result';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {tanks: 'aa', etvdata: 'ss', tank_id: '',etv_tank: ''};
    this.GetETVtable = this.GetETVtable.bind(this);
    this.getTankData = this.getTankData.bind(this);
    this.GetETVtable();
    this.getTankData()

    this.handleTankId = this.handleTankId.bind(this);
    this.handleETVTank = this.handleETVTank.bind(this);
  }

getTankData()  {
    var url = "https://api.worldoftanks.eu/wot/encyclopedia/vehicles/?application_id=883ff6ceefb13177357ffea34d6fb06f&language=cs&fields=tank_id%2Cimages.big_icon%2Cshort_name%2Ctier%2Ctype";
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      var jsondata = xhr.responseText;
      this.setState({tanks: JSON.parse(jsondata)});
    }.bind(this);
    xhr.open('GET', url , true);
    xhr.send();
  }


  GetETVtable () {
    //var url = "https://fpcstat.cz/expected_tank_values.json";
    var url = "https://static.modxvm.com/wn8-data-exp/json/wn8exp.json"
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      var jsondata = xhr.responseText;
      this.setState({etvdata: JSON.parse(jsondata)});
    }.bind(this);

    xhr.open('GET', url , true);
    xhr.send();
  }

  handleTankId(id)  {
    this.setState({tank_id: id});
  }

  handleETVTank(data) {
    this.setState({etv_tank: data});
  }



  render() {

    var pictureHeight = {
      marginTop: "10px",
      height: "130px",
    };

    return (
      <div className="w3-container w3-center">
          <h3>WN8 online calculator</h3>
          <p>I am using Expected Tank Values from server <a href="https://modxvm.com/en/wn8-expected-values/">XVM</a></p>
          
        
        <div className="w3-row-padding">
          <div className="col-sm-6 w3-padding w3-card w3-margin-bottom ">
            <Calculator tanks={this.state.tanks}  etv={this.state.etvdata} onFindTankId={this.handleTankId} onFindETV={this.handleETVTank}/>
          </div>
          <div className="w3-row-padding w3-card w3-margin-bottom">
              <div className="w3-container w3-padding" style={pictureHeight}>
                <Picture tanks={this.state.tanks} id={this.state.tank_id}/>
            </div>
          </div>
          <div className="w3-row-padding w3-card w3-padding">
                <Result etv_tank={this.state.etvdata} id={this.state.tank_id}/>
          </div>
        </div>
      </div>


    );
  }
}

export default App;
