import React from 'react';

const Picture = ({ picture_url }) => {
    let url = picture_url;

    if (url?.startsWith('http://')) {
        url = url.replace('http://', 'https://');
    }

    return <img className="w3-image" src={url} alt="" />;
};

export default Picture;
