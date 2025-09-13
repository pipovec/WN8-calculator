import React, { useState } from 'react';
import Calculator from './Calculator';
import Picture from './Picture';
import Result from './Result';

const App = () => {
    const [tankId, setTankId] = useState(0.0);
    const [tankPictureUrl, setTankPictureUrl] = useState('');
    const [etvTank, setEtvTank] = useState('');
    const [tanks, setTanks] = useState('');

    return (
        <div className="w3-container w3-center">
            <h1>WN8 online calculator</h1>
            <p>
                I am using Expected Tank Values from server{' '}
                <a href="https://modxvm.com/en/wn8-expected-values/">modxvm.com</a>
            </p>

            <div className="w3-row-padding">
                <div className="col-sm-6 w3-card w3-margin-bottom">
                    <Calculator
                        tanks={tanks}
                        onFindTankId={setTankId}
                        onFindETV={setEtvTank}
                        onFindTankPicture={setTankPictureUrl}
                    />
                </div>

                <div className="w3-row-padding w3-card w3-margin-bottom">
                    <div className="w3-container w3-padding">
                        <Picture picture_url={tankPictureUrl} />
                    </div>
                    <div className="w3-row-padding w3-card w3-padding w3-margin-bottom">
                        <Result tank_id={tankId} />
                    </div>
                </div>
            </div>

            <p>
                The source code is freely available on{' '}
                <a href="https://github.com/pipovec/WN8-calculator">Github</a>
            </p>
        </div>
    );
};

export default App;
