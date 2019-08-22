import React, { Component } from 'react';

class Picture extends Component {

  render() {    
    console.log(this.props.picture_url)
    return (              
      <img className="w3-image" src={this.props.picture_url} alt="" />              
    );
  }

}

export default Picture;
