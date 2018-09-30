import React, { Component } from 'react';

class Result extends Component {
  constructor(props) {
    super(props);
    this.Data = this.Data.bind(this);
    this.handleYFrag = this.handleYFrag.bind(this);
    this.handleYDmg = this.handleYDmg.bind(this);
    this.handleYSpot = this.handleYSpot.bind(this);
    this.handleYDef = this.handleYDef.bind(this);
    this.handleYWin = this.handleYWin.bind(this);

    this.state = {yDmg: 0.00, ySpot: 0.00, yFrag: 0.00, yDef: 0.00, yWin: 0.00};

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

  handleYFrag (e) {
    this.setState({yFrag: e.target.value})
  }

  handleYDmg (e) {
    this.setState({yDmg: e.target.value})
  }

  handleYSpot (e) {
    this.setState({ySpot: e.target.value})
  }

  handleYDef (e) {
    this.setState({yDef: e.target.value})
  }

  handleYWin (e) {
    this.setState({yWin: e.target.value})
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

    if(WN8 <= 430) {
      Wcolor = 'red';
    } else if (WN8 <= 965) {
      Wcolor = '#ebd09e';
    } else if (WN8 <= 1562) {
      Wcolor = 'yellow';
    } else if (WN8 <= 2349) {
      Wcolor = '#9dc39d';
    } else if (WN8 <= 3158) {
      Wcolor = '#afdfdb';
    } else if (WN8 > 3158) {
      Wcolor = '#e4c3e4';
    }

    var WN8Style = {
      background: Wcolor,
    }



    return (


      <div>
        <div className="w3-row-padding w3-center">
          <div className="w3-col l1 w3-hide-small"> .</div>
          <div className="w3-col l2"> <label>Frag /Kills/ </label>
            <input type="text" className="w3-input w3-round w3-border" onChange={this.handleYFrag}/>
          </div>

          <div className="w3-col l2"> <label>Damage</label>
            <input type="text" className="w3-input w3-round w3-border" onChange={this.handleYDmg}/>
          </div>

          <div className="w3-col l2"> <label>Spot</label>
            <input type="text" className="w3-input w3-round w3-border" onChange={this.handleYSpot}/>
          </div>

          <div className="w3-col l2"> <label>Def</label>
            <input type="text" className="w3-input w3-round w3-border" onChange={this.handleYDef}/>
          </div>

          <div className="w3-col l2"> <label>Win</label>
            <input type="text" className="w3-input w3-round w3-border" onChange={this.handleYWin}/>
          </div>
        </div>

        <hr />


          <table className="w3-table w3-border w3-centered w3-bordered">
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






      <div className="w3-row" style={WN8Style}>
        <div className="w3-center">
          Value of WN8: <span>{WN8} </span>
        </div>
      </div>

      </div>


    );
  }

}

export default Result;
