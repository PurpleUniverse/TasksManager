import React from 'react';
import {
    Paper,
    Typography,
    Box,
    Chip
} from '@mui/material';
import {
    CheckCircle as EnabledIcon,
    Cancel as DisabledIcon
} from '@mui/icons-material';

const FeatureToggleInfo = ({ features }) => {
    return (
        <Paper sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5' }}>
            <Typography variant="h6" gutterBottom>
                Feature Status
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip
                    icon={features.taskCategories ? <EnabledIcon /> : <DisabledIcon />}
                    label="Task Categories"
                    color={features.taskCategories ? "success" : "default"}
                    variant="outlined"
                />

                <Chip
                    icon={features.taskPriorities ? <EnabledIcon /> : <DisabledIcon />}
                    label="Task Priorities"
                    color={features.taskPriorities ? "success" : "default"}
                    variant="outlined"
                />
            </Box>

            <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                Features can be toggled on/off without requiring application redeployment.
            </Typography>
        </Paper>
    );
};

export default FeatureToggleInfo;