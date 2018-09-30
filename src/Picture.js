import React, { Component } from 'react';

class Picture extends Component {

  render() {
    for(const prop in this.props.tanks.data)     {

      if(parseInt(this.props.tanks.data[prop].tank_id,10) === parseInt(this.props.id,10))
        var picture = this.props.tanks.data[prop].images['big_icon'];

    }

    var pictureH = {
      width: "200px",
      marginLeft: "auto",
      marginRight: "auto"
    };

    return (
      <div className="w3-container">
        <div className="w3-center">
        <img className=".img-responsive rounded" style={pictureH}  src={picture} alt="" />
        </div>
      </div>
    );
  }

}

export default Picture;
