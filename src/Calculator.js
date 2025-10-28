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
        { value: 'mediumTank', label: 'Medium Tank', icon: '🎯' },
        { value: 'heavyTank', label: 'Heavy Tank', icon: '🛡️' },
        { value: 'lightTank', label: 'Light Tank', icon: '⚡' },
        { value: 'AT-SPG', label: 'Tank Destroyer', icon: '🔫' },
        { value: 'SPG', label: 'Artillery', icon: '💥' },
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Level Selection */}
            <FormControl fullWidth>
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
            <FormControl fullWidth>
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
                                <span>{tankType.icon}</span>
                                <span>{tankType.label}</span>
                            </Box>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Current Selection Info */}
            {selectedTypeInfo && (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                        label={`Tier ${level}`}
                        color="primary"
                        size="small"
                    />
                    <Chip
                        label={selectedTypeInfo.label}
                        color="secondary"
                        size="small"
                        icon={<span>{selectedTypeInfo.icon}</span>}
                    />
                </Box>
            )}

            {/* Tank Selection */}
            <FormControl fullWidth>
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