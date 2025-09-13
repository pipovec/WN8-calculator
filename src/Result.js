import React, { useEffect, useState } from 'react';
import History from './components/History';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { wn8color } from 'wn8-color';

const Result = ({ tank_id }) => {
    const [yFrag, setYFrag] = useState(0.0);
    const [yDmg, setYDmg] = useState(0.0);
    const [ySpot, setYSpot] = useState(0.0);
    const [yDef, setYDef] = useState(0.0);
    const [yWin, setYWin] = useState(0.0);

    const [rFragc, setRFragc] = useState(0.0);
    const [rDMGc, setRDMGc] = useState(0.0);
    const [rSpotc, setRSpotc] = useState(0.0);
    const [rDefc, setRDefc] = useState(0.0);
    const [rWinc, setRWinc] = useState(0.0);


    const [developerMode, setDeveloperMode] = useState(false);
    const [historyMode, setHistoryMode] = useState(false);

    const [tankEtvData, setTankEtvData] = useState({});
    const [WN8, setWN8] = useState(0.0);

    // Fetch expected values for tank
    useEffect(() => {
        const fetchTankData = async () => {
            if (tank_id !== 0) {
                try {
                    const apiURL = `${process.env.REACT_APP_API_URL}/api/expected-tank-values/${tank_id}`;
                    const response = await fetch(apiURL, { headers: { Accept: 'application/json' } });
                    const data = await response.json();
                    setTankEtvData(data.data);
                } catch (error) {
                    console.error('Failed to fetch tank data:', error);
                }
            }
        };
        fetchTankData();
    }, [tank_id]);

    // Load average values from API data
    const clickAvgValue = () => {
        setYFrag(tankEtvData.expFrag || 0);
        setYDmg(tankEtvData.expDamage || 0);
        setYSpot(tankEtvData.expSpot || 0);
        setYDef(tankEtvData.expDef || 0);
        setYWin(tankEtvData.expWinRate || 0);
    };

    // --- Calculation helpers ---
    const returnStep1 = (expValue, yValue) => {
        const result = yValue / expValue;
        return isNaN(result) ? 0.0 : parseFloat(result.toFixed(4));
    };

    const returnrDMGc = (expValue, yValue) => {
        const rDMG = yValue / expValue;
        const rDAMAGEc = Math.max(0, (rDMG - 0.22) / (1 - 0.22));
        setRDMGc(isNaN(rDAMAGEc) ? 0.0 : parseFloat(rDAMAGEc.toFixed(4)));
        return isNaN(rDAMAGEc) ? 0.0 : parseFloat(rDAMAGEc.toFixed(4));
    };

    const returnrFRAGc = (expValue, yValue, rDMGc) => {
        const rFRAG = yValue / expValue;
        let rFRAGc = Math.max(0, Math.min(rDMGc + 0.2, (rFRAG - 0.12) / (1 - 0.12)));
        setRFragc(isNaN(rFRAGc) ? 0.0 : parseFloat(rFRAGc.toFixed(4)));
        return isNaN(rFRAGc) ? 0.0 : parseFloat(rFRAGc.toFixed(4));
    };

    const returnrWINc = (expValue, yValue) => {
        const rWIN = yValue / expValue;
        let rWINc = Math.max(0, (rWIN - 0.71) / (1 - 0.71));
        setRWinc(isNaN(rWINc) ? 0.0 : parseFloat(rWINc.toFixed(4)));
        return isNaN(rWINc) ? 0.0 : parseFloat(rWINc.toFixed(4));
    };

    const returnrSPOTc = (expValue, yValue, rDMGc) => {
        const rSPOT = yValue / expValue;
        let rSPOTc = Math.max(0, Math.min(rDMGc + 0.1, (rSPOT - 0.38) / (1 - 0.38)));
        setRSpotc(isNaN(rSPOTc) ? 0.0 : parseFloat(rSPOTc.toFixed(4)));
        return isNaN(rSPOTc) ? 0.0 : parseFloat(rSPOTc.toFixed(4));
    };

    const returnrDEFc = (expValue, yValue, rDMGc) => {
        const rDEF = yValue / expValue;
        let rDEFc = Math.max(0, Math.min(rDMGc + 0.1, (rDEF - 0.1) / (1 - 0.1)));
        setRDefc(isNaN(rDEFc) ? 0.0 : parseFloat(rDEFc.toFixed(4)));
        return isNaN(rDEFc) ? 0.0 : parseFloat(rDEFc.toFixed(4));
    };

    // Compute WN8 when inputs change
    useEffect(() => {
        if (!tankEtvData.expDamage) return;

        const rDMGc = returnrDMGc(tankEtvData.expDamage, yDmg);
        const rFragc = returnrFRAGc(tankEtvData.expFrag, yFrag, rDMGc);
        const rWinc = returnrWINc(tankEtvData.expWinRate, yWin);
        const rSpotc = returnrSPOTc(tankEtvData.expSpot, ySpot, rDMGc);
        const rDefc = returnrDEFc(tankEtvData.expDef, yDef, rDMGc);

        const wn8 =
            980 * rDMGc +
            210 * rDMGc * rFragc +
            155 * rFragc * rSpotc +
            75 * rDefc * rFragc +
            145 * Math.min(1.8, rWinc);

        setWN8(parseFloat(wn8.toFixed(2)));
    }, [tankEtvData, yFrag, yDmg, ySpot, yDef, yWin]);

    // Style based on WN8 value
    const wn8style = (WN8) => ({
        background: wn8color(WN8),
    });

    return (
        <div>
            <div className="w3-cell-row">
                <div className="w3-padding w3-cell w3-mobile">
                    <TextField
                        onChange={(e) => setYFrag(e.target.value)}
                        value={yFrag}
                        label="Frags /Kills/"
                        variant="outlined"
                    />
                </div>
                <div className="w3-padding w3-cell w3-mobile">
                    <TextField
                        onChange={(e) => setYDmg(e.target.value)}
                        value={yDmg}
                        label="Damage dealt"
                        variant="outlined"
                    />
                </div>
                <div className="w3-padding w3-cell w3-mobile">
                    <TextField
                        onChange={(e) => setYSpot(e.target.value)}
                        value={ySpot}
                        label="Enemies spotted"
                        variant="outlined"
                    />
                </div>
                <div className="w3-padding w3-cell w3-mobile">
                    <TextField
                        onChange={(e) => setYDef(e.target.value)}
                        value={yDef}
                        label="Dropped capture points"
                        variant="outlined"
                    />
                </div>
                <div className="w3-padding w3-cell w3-mobile">
                    <TextField
                        onChange={(e) => setYWin(e.target.value)}
                        value={yWin}
                        label="Winrate"
                        variant="outlined"
                    />
                </div>
            </div>

            <Divider variant="fullWidth" />

            <div className="w3-padding">
                <FormGroup row>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={developerMode}
                                disabled={!(!historyMode && tank_id !== 0)}
                                onChange={() => setDeveloperMode(!developerMode)}
                            />
                        }
                        label="Developer mode"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={historyMode}
                                disabled={!(!developerMode && tank_id !== 0)}
                                onChange={() => setHistoryMode(!historyMode)}
                            />
                        }
                        label="History"
                    />
                    <Button variant="contained" onClick={clickAvgValue}>
                        Load average value
                    </Button>
                </FormGroup>
            </div>

            <Divider variant="fullWidth" />

            {developerMode && tank_id > 0 && (
                <table className="w3-table w3-border w3-centered w3-bordered w3-margin-top">
                    <thead className="w3-tiny">
                    <tr>
                        <th>expFrag</th>
                        <th>expDMG</th>
                        <th>expSpot</th>
                        <th>expDef</th>
                        <th>expWin</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{tankEtvData.expFrag}</td>
                        <td>{tankEtvData.expDamage}</td>
                        <td>{tankEtvData.expSpot}</td>
                        <td>{tankEtvData.expDef}</td>
                        <td>{tankEtvData.expWinRate}</td>
                    </tr>
                    </tbody>
                    <thead className="w3-tiny">
                    <tr>
                        <th>rFrag</th>
                        <th>rDMG</th>
                        <th>rSpot</th>
                        <th>rDef</th>
                        <th>rWin</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{returnStep1(tankEtvData.expFrag, yFrag)}</td>
                        <td>{returnStep1(tankEtvData.expDamage, yDmg)}</td>
                        <td>{returnStep1(tankEtvData.expSpot, ySpot)}</td>
                        <td>{returnStep1(tankEtvData.expDef, yDef)}</td>
                        <td>{returnStep1(tankEtvData.expWinRate, yWin)}</td>
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
            )}

            {historyMode && tank_id > 0 && <History tankId={tank_id} />}

            <div className="w3-row w3-margin-top" style={wn8style(WN8)}>
                <div className="w3-center">
                    <h2 style={{ color: 'white' }}>
                        <strong>{WN8}</strong>
                    </h2>
                </div>
            </div>
        </div>
    );
};

export default Result;
