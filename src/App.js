import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Link from '@mui/material/Link';
import GitHubIcon from '@mui/icons-material/GitHub';
import InfoIcon from '@mui/icons-material/Info';
import Alert from '@mui/material/Alert';

import theme from './theme';
import Calculator from './Calculator';
import Picture from './Picture';
import Result from './Result';

const App = () => {
    const [tankId, setTankId] = useState(0.0);
    const [tankPictureUrl, setTankPictureUrl] = useState('');

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
                sx={{
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #485461 0%, #28313b 100%)',
                    py: 4,
                }}
            >
                <Container maxWidth={false} sx={{ maxWidth: '1024px' }}>
                    {/* Header */}
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography
                            variant="h1"
                            sx={{
                                color: 'white',
                                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                                mb: 2,
                            }}
                        >
                            WN8 Calculator
                        </Typography>
                        <Alert
                            icon={<InfoIcon />}
                            severity="info"
                            sx={{
                                maxWidth: 600,
                                mx: 'auto',
                                backgroundColor: 'rgba(255,255,255,0.95)',
                            }}
                        >
                            Using Expected Tank Values from{' '}
                            <Link
                                href="https://modxvm.com/en/wn8-expected-values/"
                                target="_blank"
                                rel="noopener"
                            >
                                modxvm.com
                            </Link>
                        </Alert>
                    </Box>

                    {/* Main Content */}
                    <Grid container spacing={3} direction="column">
                        {/* Calculator - Full Width */}
                        <Grid size={12}>
                            <Card
                                sx={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'none',
                                    transform: 'none',
                                    '&:hover': {
                                        transform: 'none',
                                        boxShadow: (theme) => theme.shadows[1], // zachováva rovnaký tieň
                                    }
                                }}
                            >
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography
                                        variant="h3"
                                        gutterBottom
                                        sx={{
                                            color: 'primary.main',
                                            mb: 3,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                        }}
                                    >
                                        Select Your Tank
                                    </Typography>
                                    <Calculator
                                        onFindTankId={setTankId}
                                        onFindTankPicture={setTankPictureUrl}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Tank Picture - Full Width */}
                        <Grid size={12}>
                            <Card
                                sx={{
                                    transition: 'none',
                                    transform: 'none',
                                    '&:hover': {
                                        transform: 'none',
                                        boxShadow: (theme) => theme.shadows[1], // zachováva rovnaký tieň
                                    }
                                }}
                            >
                                <CardContent>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            minHeight: 200,
                                            backgroundColor: '#f8f9fa',
                                            borderRadius: 2,
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <Picture picture_url={tankPictureUrl} />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* WN8 Result - Full Width */}
                        <Grid size={12}>
                            <Card
                                sx={{
                                    transition: 'none',
                                    transform: 'none',
                                    '&:hover': {
                                        transform: 'none',
                                        boxShadow: (theme) => theme.shadows[1], // zachováva rovnaký tieň
                                    }
                                }}
                            >
                                <CardContent>
                                    <Result tank_id={tankId} />
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Footer */}
                    <Box
                        sx={{
                            mt: 6,
                            textAlign: 'center',
                            color: 'white',
                        }}
                    >
                        <Link
                            href="https://github.com/pipovec/WN8-calculator"
                            target="_blank"
                            rel="noopener"
                            sx={{
                                color: 'white',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 1,
                                textDecoration: 'none',
                                '&:hover': {
                                    textDecoration: 'underline',
                                },
                            }}
                        >
                            <GitHubIcon />
                            View Source Code on GitHub
                        </Link>
                    </Box>
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default App;