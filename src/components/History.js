import React, { useCallback, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Link from '@mui/material/Link';
import TimelineIcon from '@mui/icons-material/Timeline';
import LineChart from './Chart';
import moment from 'moment';

const History = ({ tankId }) => {
    const [loading, setLoading] = useState(false);
    const [charts, setCharts] = useState({
        frags: [],
        dmg: [],
        spot: [],
        def: [],
        win: [],
    });

    const getHistoryData = useCallback(async () => {
        setLoading(true);
        const date = moment().day(-14).format('YYYY-MM-DD');
        const urlApi = new URL(
            `https://api2.fpcstat.cz/api/expected_tank_value_histories`
        );

        const params = {
            tank_id: tankId,
            'date[after]': date,
            'order[date]': 'DESC',
        };

        urlApi.search = new URLSearchParams(params).toString();

        try {
            const response = await fetch(urlApi, {
                headers: { Accept: 'application/json' },
            });
            const json = await response.json();
            setCharData(json);
        } catch (error) {
            console.error('Error fetching history data:', error);
        } finally {
            setLoading(false);
        }
    }, [tankId]);

    useEffect(() => {
        if (tankId > 0) {
            getHistoryData();
        }
    }, [tankId, getHistoryData]);

    const setCharData = (data) => {
        setCharts({
            frags: data.map((el) => ({ y: el.frag, x: el.date })),
            dmg: data.map((el) => ({ y: el.dmg, x: el.date })),
            spot: data.map((el) => ({ y: el.spot, x: el.date })),
            def: data.map((el) => ({ y: el.def, x: el.date })),
            win: data.map((el) => ({ y: el.win, x: el.date })),
        });
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 3,
                }}
            >
                <TimelineIcon color="primary" />
                <Typography variant="h6" color="primary">
                    Historical Data (Last 14 Days)
                </Typography>
            </Box>

            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper elevation={2} sx={{ p: 2 }}>
                        <LineChart data={charts.frags} name="Frags History" />
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper elevation={2} sx={{ p: 2 }}>
                        <LineChart data={charts.dmg} name="Damage History" />
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper elevation={2} sx={{ p: 2 }}>
                        <LineChart data={charts.spot} name="Spot History" />
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper elevation={2} sx={{ p: 2 }}>
                        <LineChart data={charts.def} name="Defense History" />
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper elevation={2} sx={{ p: 2 }}>
                        <LineChart data={charts.win} name="Win Rate History" />
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper
                        elevation={2}
                        sx={{
                            p: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: 200,
                        }}
                    >
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" gutterBottom>
                                Need More Data?
                            </Typography>
                            <Link
                                href="https://etvh.fpcstat.cz"
                                target="_blank"
                                rel="noopener"
                                sx={{ fontSize: '1.1rem' }}
                            >
                                View Extended Historical Data →
                            </Link>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default History;