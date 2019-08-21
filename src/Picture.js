import React, { Component } from 'react';

class Picture extends Component {

  render() {
    for(const prop in this.props.tanks.data)     {

      if(parseInt(this.props.tanks.data[prop].tank_id,10) === parseInt(this.props.id,10))
        var picture = this.props.tanks.data[prop].images['big_icon'];

    }

    return (              
      <img className="w3-image" src={picture} alt="" />        
      
    );
  }

}

export default Picture;
