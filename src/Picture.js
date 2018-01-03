import React, { Component } from 'react';

class Picture extends Component {

  render() {
    for(const prop in this.props.tanks.data)     {

      if(parseInt(this.props.tanks.data[prop].tank_id,10) === parseInt(this.props.id,10))
        var picture = this.props.tanks.data[prop].images['big_icon'];
        
    }

    return (
      <div className="well" style={{height: 120}}>
          <img className=".img-responsive rounded" src={picture} alt="" />
      </div>

    );
  }

}

export default Picture;
