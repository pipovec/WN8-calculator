import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Alert from '@mui/material/Alert';
import { wn8color } from 'wn8-color';

import History from './components/History';

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

    // Calculation helpers
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

    // Get WN8 rating label
    const getWN8Label = (wn8) => {
        if (wn8 < 300) return 'Very Bad';
        if (wn8 < 450) return 'Bad';
        if (wn8 < 650) return 'Below Average';
        if (wn8 < 900) return 'Average';
        if (wn8 < 1200) return 'Above Average';
        if (wn8 < 1600) return 'Good';
        if (wn8 < 2000) return 'Very Good';
        if (wn8 < 2450) return 'Great';
        if (wn8 < 2900) return 'Unicum';
        return 'Super Unicum';
    };

    if (tank_id === 0) {
        return (
            <Alert severity="info">
                Please select a tank to calculate WN8
            </Alert>
        );
    }

    return (
        <Box>
            {/* WN8 Result Display */}
            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    mb: 3,
                    textAlign: 'center',
                    backgroundColor: wn8color(WN8),
                    color: 'white',
                    borderRadius: 3,
                }}
            >
                <Typography variant="h2" sx={{ fontWeight: 700, mb: 1 }}>
                    {WN8}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    {getWN8Label(WN8)}
                </Typography>
            </Paper>

            {/* Input Fields */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        fullWidth
                        type="number"
                        label="Frags (Kills)"
                        value={yFrag}
                        onChange={(e) => setYFrag(e.target.value)}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        fullWidth
                        type="number"
                        label="Damage Dealt"
                        value={yDmg}
                        onChange={(e) => setYDmg(e.target.value)}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        fullWidth
                        type="number"
                        label="Enemies Spotted"
                        value={ySpot}
                        onChange={(e) => setYSpot(e.target.value)}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        fullWidth
                        type="number"
                        label="Defense Points"
                        value={yDef}
                        onChange={(e) => setYDef(e.target.value)}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        fullWidth
                        type="number"
                        label="Win Rate (%)"
                        value={yWin}
                        onChange={(e) => setYWin(e.target.value)}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={clickAvgValue}
                        sx={{ height: '56px' }}
                    >
                        Load Average Values
                    </Button>
                </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Options */}
            <FormGroup row sx={{ mb: 3, justifyContent: 'center' }}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={developerMode}
                            disabled={historyMode}
                            onChange={() => setDeveloperMode(!developerMode)}
                        />
                    }
                    label="Developer Mode"
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={historyMode}
                            disabled={developerMode}
                            onChange={() => setHistoryMode(!historyMode)}
                        />
                    }
                    label="History"
                />
            </FormGroup>

            {/* Developer Mode Table */}
            <Collapse in={developerMode}>
                <TableContainer component={Paper} sx={{ mb: 3 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <Typography variant="subtitle2">Expected Values</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>expFrag</TableCell>
                                <TableCell>expDamage</TableCell>
                                <TableCell>expSpot</TableCell>
                                <TableCell>expDef</TableCell>
                                <TableCell>expWin</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>{tankEtvData.expFrag}</TableCell>
                                <TableCell>{tankEtvData.expDamage}</TableCell>
                                <TableCell>{tankEtvData.expSpot}</TableCell>
                                <TableCell>{tankEtvData.expDef}</TableCell>
                                <TableCell>{tankEtvData.expWinRate}</TableCell>
                            </TableRow>
                        </TableBody>

                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <Typography variant="subtitle2">Ratio Values</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>rFrag</TableCell>
                                <TableCell>rDamage</TableCell>
                                <TableCell>rSpot</TableCell>
                                <TableCell>rDef</TableCell>
                                <TableCell>rWin</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>{returnStep1(tankEtvData.expFrag, yFrag)}</TableCell>
                                <TableCell>{returnStep1(tankEtvData.expDamage, yDmg)}</TableCell>
                                <TableCell>{returnStep1(tankEtvData.expSpot, ySpot)}</TableCell>
                                <TableCell>{returnStep1(tankEtvData.expDef, yDef)}</TableCell>
                                <TableCell>{returnStep1(tankEtvData.expWinRate, yWin)}</TableCell>
                            </TableRow>
                        </TableBody>

                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <Typography variant="subtitle2">Capped Ratio Values</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>rFragc</TableCell>
                                <TableCell>rDamagec</TableCell>
                                <TableCell>rSpotc</TableCell>
                                <TableCell>rDefc</TableCell>
                                <TableCell>rWinc</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>{rFragc}</TableCell>
                                <TableCell>{rDMGc}</TableCell>
                                <TableCell>{rSpotc}</TableCell>
                                <TableCell>{rDefc}</TableCell>
                                <TableCell>{rWinc}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Collapse>

            {/* History Mode */}
            <Collapse in={historyMode}>
                <History tankId={tank_id} />
            </Collapse>
        </Box>
    );
};

export default Result;