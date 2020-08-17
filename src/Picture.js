import React, { Component } from 'react';

class Picture extends Component {

  render() {   
    let url = this.props.picture_url

    if(url.match('^http://')){
     url = url.replace("http://","https://")
    }

    return (              
      <img className="w3-image" src={url} alt=""/>              
    );
  }

}
export default Picture;
