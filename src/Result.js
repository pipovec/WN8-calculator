import React, { Component } from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';


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
    

    this.state = {
      yDmg: 0.00,
      ySpot: 0.00,
      yFrag: 0.00,
      yDef: 0.00,
      yWin: 0.00,
      developerMode: false      
    };

  }

  Data () {

    var data = this.props.etv_tank.data;
    var dat = [];
    for(const prop in this.props.etv_tank.data)  {
      if(parseInt(data[prop].IDNum,10 ) === parseInt(this.props.id,10))
      {
        dat[0] = data[prop].IDNum;
        dat[1] = data[prop].expDamage;
        dat[2] = data[prop].expDef;
        dat[3] = data[prop].expFrag;
        dat[4] = data[prop].expSpot;
        dat[5] = data[prop].expWinRate;
      }

    }

    return dat;
  }

  clickAvgValue() {

    let data = this.Data()
    
    this.setState({
      yFrag: data[3],
      yDmg: data[1],
      ySpot: data[4],
      yDef: data[2],
      yWin: data[5],
      
    })
    this.forceUpdate();
  }
  
  handleYFrag (e) {
    this.setState({yFrag: e.target.value, clickKill: e.target.value})
  }

  handleYDmg (e) {
    this.setState({yDmg: e.target.value, clickDmg: e.target.value})
  }

  handleYSpot (e) {
    this.setState({ySpot: e.target.value, clickSpot: e.target.value})
  }

  handleYDef (e) {
    this.setState({yDef: e.target.value, clickDef: e.target.value})
  }

  handleYWin (e) {
    this.setState({yWin: e.target.value, clickWin: e.target.value})
  }

  returnStep1(expValue, yValue) {
    var result = yValue/expValue;
    result = result.toFixed(4);

    if(isNaN(result))  {
      result = 0.0
    }

    return result;
  }

  returnrFRAGc(expValue,yValue,rDMGc) {
    var rFRAG = yValue/expValue;
    rDMGc = parseFloat(rDMGc);

    var rFRAGc = Math.max(0,Math.min(rDMGc + 0.2,(rFRAG   - 0.12)/(1 - 0.12)));

    if(isNaN(rFRAGc))  {
      rFRAGc = 0.0
    }

    rFRAGc = rFRAGc.toFixed(4);



    return rFRAGc;
  }

  returnrDMGc(expValue, yValue) {
    var rDMG =  yValue/expValue;
    var rDAMAGEc = Math.max(0,(rDMG - 0.22) / (1 - 0.22) );

    if(isNaN(rDAMAGEc))  {
      rDAMAGEc = 0.0
    }

    return rDAMAGEc.toFixed(4);
  }

  returnrWINc(expValue, yValue) {
    var rWIN     = yValue/expValue;
    rWIN         = parseFloat(rWIN);
    var rWINc    = Math.max(0,(rWIN    - 0.71) / (1 - 0.71) );

    if(isNaN(rWINc))  {
      rWINc = 0.0
    }

    return rWINc.toFixed(4);
  }

  returnrSPOTc(expValue,yValue,rDMGc) {
    rDMGc        = parseFloat(rDMGc);
    var rSPOT    = yValue/expValue;
    var rSPOTc   = Math.max(0, Math.min(rDMGc + 0.1, (rSPOT   - 0.38) / (1 - 0.38)));

    if(isNaN(rSPOTc))  {
      rSPOTc = 0.0
    }

    return rSPOTc.toFixed(4);
  }

  returnrDEFc(expValue,yValue,rDMGc) {
    rDMGc        = parseFloat(rDMGc);
    var rDEF     = yValue/expValue;
    var rDEFc    = Math.max(0, Math.min(rDMGc + 0.1, (rDEF    - 0.10) / (1 - 0.10)));

    if(isNaN(rDEFc))  {
      rDEFc = 0.0
    }

    return rDEFc.toFixed(4);
  }



  render() {
    
    const handleSwitch = name => event => {
      this.setState({  [name]: event.target.checked });
    };

    var s = this.Data();
    if(s[3]== null){s[3]=0;s[1]=0;s[2]=0;s[4]=0;s[5]=0;}
    var rDMGc  = this.returnrDMGc(s[1],this.state.yDmg);
    var rFragc = this.returnrFRAGc(s[3],this.state.yFrag,rDMGc);
    var rWinc  = this.returnrWINc(s[5],this.state.yWin);
    var rSpotc = this.returnrSPOTc(s[4],this.state.ySpot,rDMGc);
    var rDefc  = this.returnrDEFc(s[2],this.state.yDef,rDMGc);
    var WN8 = 980*rDMGc + 210*rDMGc*rFragc + 155*rFragc*rSpotc + 75*rDefc*rFragc + 145*Math.min(1.8,rWinc);
    WN8 = WN8.toFixed(2);

    var Wcolor = 'red';


    if(WN8 <= 449) {
      Wcolor = 'grey';
    } else if (WN8 >= 450 && WN8 < 649.99) {
      Wcolor = '#e5000';
    } else if (WN8 >= 650 && WN8 < 849.99) {
      Wcolor = '#cd3333';
    } else if (WN8 >= 850 && WN8 < 1049.99) {
      Wcolor = '#d77900';
    } else if (WN8 >= 1050 && WN8 < 1249.99) {
      Wcolor = '#d7B600';
    } else if (WN8 >= 1250 && WN8 < 1399.99) {
      Wcolor = '#6d9251';
    }else if (WN8 >= 1400 && WN8 < 1599.99) {
      Wcolor = '#4c762e';
    } else if (WN8 >= 1600 && WN8 < 1999.99) {
      Wcolor = '#46a892';
    } else if (WN8 >= 2000 && WN8 < 2449.99) {
      Wcolor = '#4a92b7';
    } else if (WN8 >= 2450 && WN8 < 2849.99) {
      Wcolor = '#83579d';
    } else if (WN8 >= 2850 ) {
      Wcolor = '#5a3175';
    }

    var WN8Style = {
      background: Wcolor,
    }

    const devMode = this.state.developerMode;
    let dev;
      
      if( devMode )
      {
        dev = <table className="w3-table w3-border w3-centered w3-bordered w3-margin-top">
                    <thead className="w3-tiny">
                      <tr><th className="text-center">expFrag</th>
                          <th className="text-center">expDMG</th>
                          <th className="text-center">expSpot</th>
                          <th className="text-center">expDef</th>
                          <th className="text-center">expWin</th></tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{s[3]}</td>
                        <td>{s[1]}</td>
                        <td>{s[4]}</td>
                        <td>{s[2]}</td>
                        <td>{s[5]}</td>
                      </tr>
                    </tbody>
                    <thead className="w3-tiny">
                    <tr><th className="text-center">rFrag</th>
                        <th className="text-center">rDMG</th>
                        <th className="text-center">rSpot</th>
                        <th className="text-center">rDef</th>
                        <th className="text-center">rWin</th></tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{this.returnStep1(s[3],this.state.yFrag)}</td>
                      <td>{this.returnStep1(s[1],this.state.yDmg)}</td>
                      <td>{this.returnStep1(s[4],this.state.ySpot)}</td>
                      <td>{this.returnStep1(s[2],this.state.yDef)}</td>
                      <td>{this.returnStep1(s[5],this.state.yWin)}</td>
                    </tr>
                  </tbody>
                  <thead className="w3-tiny">
                    <tr><th className="text-center">rFragc</th>
                        <th className="text-center">rDamagec</th>
                        <th className="text-center">rSpotc</th>
                        <th className="text-center">rDefc</th>
                        <th className="text-center">rWinc</th></tr>
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
    }
    else{
      dev = ''
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
              InputProps={{
                startAdornment: <InputAdornment position="start"></InputAdornment>,
              }}
              />
          </div>

          <div className="w3-padding w3-cell w3-mobile">
            <TextField
            onChange={this.handleYDmg} value={this.state.yDmg}
            id="outlined-simple-start-adornment"        
            variant="outlined"
            label="Damage dealt"
            InputProps={{
              startAdornment: <InputAdornment position="start"></InputAdornment>,
            }}
            />
          </div>

          <div className="w3-padding w3-cell w3-mobile">
            <TextField
            onChange={this.handleYSpot} value={this.state.ySpot}
            id="outlined-simple-start-adornment"        
            variant="outlined"
            label="Enemies spotted"
            InputProps={{
              startAdornment: <InputAdornment position="start"></InputAdornment>,
            }}
            />        
          </div>

          <div className="w3-padding w3-cell w3-mobile">
            <TextField
            onChange={this.handleYDef} value={this.state.yDef}
            id="outlined-simple-start-adornment"        
            variant="outlined"
            label="Dropped capture points"
            InputProps={{
              startAdornment: <InputAdornment position="start"></InputAdornment>,
            }}
            />
          </div>

          <div className="w3-padding w3-cell w3-mobile">
            <TextField
            onChange={this.handleYWin} value={this.state.yWin}
            id="outlined-simple-start-adornment"        
            variant="outlined"
            label="Winrate"
            InputProps={{
              startAdornment: <InputAdornment position="start"></InputAdornment>,
            }}
            />            
          </div>
        </div>
        
        
        <Divider variant="fullWidth" component="hr" />
        <div className="w3-padding">
        <FormGroup row>
          <FormControlLabel
            control={
              <Switch checked={this.state.developerMode} onChange={handleSwitch('developerMode')} Wcolor="default" size="medium" />
            }
          label="Developer mode"  />   
          <Button variant="contained" onClick={this.clickAvgValue}>Load average value</Button>       
        </FormGroup>
        </div>
       
        <Divider variant="fullWidth" component="hr"/>
        {dev}

      <div className="w3-row w3-margin-top" style={WN8Style}>
        <div className="w3-center">
          <h2><strong>{WN8}</strong></h2>
        </div>
      </div>

      </div>


    );
  }

}

export default Result;
