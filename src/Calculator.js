import React, { useEffect, useState } from 'react';
import NativeSelect from '@mui/material/NativeSelect';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

const Calculator = ({ onFindTankId, onFindTankPicture }) => {
    const [type, setType] = useState('mediumTank');
    const [level, setLevel] = useState('11');
    const [tankId, setTankId] = useState('0');
    const [tanks, setTanks] = useState([]);

    // Fetchovanie dát
    const fetchTanks = async (level, type) => {
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
        }
    };

    // Načítanie pri mountnutí
    useEffect(() => {
        fetchTanks(level, type);
    }, [level, type]);

    const handleType = (e) => {
        setType(e.target.value);
    };

    const handleLevel = (e) => {
        setLevel(e.target.value);
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

    return (
        <div className="w3-row-padding w3-padding">
            {/* Výber levelu */}
            <div className="w3-third">
                <FormControl fullWidth margin="dense" variant="outlined">
                    <InputLabel shrink>Level</InputLabel>
                    <NativeSelect value={level} onChange={handleLevel} name="Level">
                        {Array.from({ length: 11 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                                {i + 1}
                            </option>
                        ))}
                    </NativeSelect>
                </FormControl>
            </div>

            {/* Výber typu */}
            <div className="w3-third">
                <FormControl fullWidth margin="dense" variant="outlined">
                    <InputLabel shrink>Type</InputLabel>
                    <NativeSelect value={type} onChange={handleType}>
                        <option value="mediumTank">mediumTank</option>
                        <option value="heavyTank">heavyTank</option>
                        <option value="lightTank">lightTank</option>
                        <option value="AT-SPG">TD</option>
                        <option value="SPG">SPG</option>
                    </NativeSelect>
                </FormControl>
            </div>

            {/* Výber tanku */}
            <div className="w3-third">
                <FormControl fullWidth margin="dense" variant="outlined">
                    <InputLabel shrink>Tank</InputLabel>
                    <NativeSelect value={tankId} onChange={handleTank}>
                        <option value="0">Choose your tank</option>
                        {tanks.length > 0 ? (
                            tanks.map((tank) => (
                                <option key={tank.data.tank_id} value={tank.data.tank_id}>
                                    {tank.name}
                                </option>
                            ))
                        ) : (
                            <option value="">Loading data ...</option>
                        )}
                    </NativeSelect>
                </FormControl>
            </div>
        </div>
    );
};

export default Calculator;
