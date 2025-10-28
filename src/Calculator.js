import React, { useEffect, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

const Calculator = ({ onFindTankId, onFindTankPicture }) => {
    const [type, setType] = useState('mediumTank');
    const [level, setLevel] = useState('11');
    const [tankId, setTankId] = useState('0');
    const [tanks, setTanks] = useState([]);
    const [loading, setLoading] = useState(false);

    const tankTypes = [
        { value: 'mediumTank', label: 'Medium Tank', icon: 'https://eu-wotp.wgcdn.co/dcont/fb/image/tactics_mt.png' },
        { value: 'heavyTank', label: 'Heavy Tank', icon: 'https://eu-wotp.wgcdn.co/dcont/fb/image/tactics_ht.png' },
        { value: 'lightTank', label: 'Light Tank', icon: 'https://eu-wotp.wgcdn.co/dcont/fb/image/tactics_lt.png' },
        { value: 'AT-SPG', label: 'Tank Destroyer', icon: 'https://eu-wotp.wgcdn.co/dcont/fb/image/tactics_td.png' },
        { value: 'SPG', label: 'Artillery', icon: 'https://eu-wotp.wgcdn.co/dcont/fb/image/tactics_arty.png' },
    ];

    // Fetch tanks data
    const fetchTanks = async (level, type) => {
        setLoading(true);
        try {
            const urlApi = `${process.env.REACT_APP_API_URL}/api/encyclopedia-vehicles`;
            const params = new URLSearchParams({ level, type }).toString();

            const response = await fetch(`${urlApi}?${params}`, {
                headers: { Accept: 'application/json' },
            });

            const data = await response.json();
            setTanks(data);
        } catch (error) {
            console.error('Failed to fetch tanks:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTanks(level, type);
    }, [level, type]);

    const handleType = (e) => {
        setType(e.target.value);
        setTankId('0');
    };

    const handleLevel = (e) => {
        setLevel(e.target.value);
        setTankId('0');
    };

    const handleTank = (e) => {
        const selectedTankId = e.target.value;

        setTankId(selectedTankId);
        onFindTankId(selectedTankId);

        const selectedTank = tanks.find((t) => t.data.tank_id === parseInt(selectedTankId, 10));

        if (selectedTank) {
            onFindTankPicture(selectedTank.data.images.big_icon);
        }
    };

    const selectedTypeInfo = tankTypes.find((t) => t.value === type);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
            {/* Selects in flexbox - horizontal on large screens */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', lg: 'row' },
                    gap: 2,
                    width: '100%'
                }}
            >
                {/* Level Selection */}
                <FormControl sx={{ flex: { xs: '1 1 100%', lg: '1 1 33%' } }}>
                    <InputLabel id="level-label">Tank Level</InputLabel>
                    <Select
                        labelId="level-label"
                        value={level}
                        label="Tank Level"
                        onChange={handleLevel}
                    >
                        {Array.from({ length: 11 }, (_, i) => (
                            <MenuItem key={i + 1} value={i + 1}>
                                Tier {i + 1}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Type Selection */}
                <FormControl sx={{ flex: { xs: '1 1 100%', lg: '1 1 33%' } }}>
                    <InputLabel id="type-label">Tank Type</InputLabel>
                    <Select
                        labelId="type-label"
                        value={type}
                        label="Tank Type"
                        onChange={handleType}
                    >
                        {tankTypes.map((tankType) => (
                            <MenuItem key={tankType.value} value={tankType.value}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {/* POUŽITIE OBRÁZKA namiesto ikony */}
                                    <img
                                        src={tankType.icon}
                                        alt={`${tankType.label} icon`}
                                        style={{ width: 24, height: 24, objectFit: 'contain' }}
                                    />
                                    <span>{tankType.label}</span>
                                </Box>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Tank Selection */}
                <FormControl sx={{ flex: { xs: '1 1 100%', lg: '1 1 33%' } }}>
                    <InputLabel id="tank-label">Select Tank</InputLabel>
                    <Select
                        labelId="tank-label"
                        value={tankId}
                        label="Select Tank"
                        onChange={handleTank}
                        disabled={loading || tanks.length === 0}
                    >
                        <MenuItem value="0">
                            {loading ? 'Loading tanks...' : 'Choose your tank'}
                        </MenuItem>
                        {tanks.length > 0 &&
                            tanks.map((tank) => (
                                <MenuItem key={tank.data.tank_id} value={tank.data.tank_id}>
                                    {tank.name}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>
            </Box>

            {/* Current Selection Info */}
            {selectedTypeInfo && (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                        label={`Tier ${level}`}
                        color="primary"
                        size="medium"
                    />
                    <Chip
                        label={selectedTypeInfo.label}
                        color="primary"
                        size="medium"
                        icon={
                            <img
                                src={selectedTypeInfo.icon}
                                alt={`${selectedTypeInfo.label} icon`}
                                style={{ width: 16, height: 16, objectFit: 'contain' }}
                            />
                        }
                    />
                </Box>
            )}

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                    <CircularProgress size={30} />
                </Box>
            )}

            {!loading && tanks.length === 0 && (
                <Typography variant="body2" color="text.secondary" align="center">
                    No tanks available for this selection
                </Typography>
            )}
        </Box>
    );
};

export default Calculator;