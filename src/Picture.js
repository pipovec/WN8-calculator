import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const Picture = ({ picture_url }) => {
    let url = picture_url;

    if (url?.startsWith('http://')) {
        url = url.replace('http://', 'https://');
    }

    if (!url) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 200,
                    color: 'text.secondary',
                }}
            >
                <Typography variant="body1">
                    Select a tank to view its image
                </Typography>
            </Box>
        );
    }

    return (
        <img
            src={url}
            alt="Tank"
            style={{
                maxWidth: '100%',
                height: 'auto',
                display: 'block',
                margin: '0 auto',
            }}
        />
    );
};

export default Picture;