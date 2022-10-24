import {
    Box,
    CircularProgress,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import React, { useEffect, useReducer, useState } from 'react';
import { deleteShippingOption, getShippingOptions } from '../../../api/api';
import dialog from '../../../services/dialog';
import AddShipping from './AddShipping';

function TabShipping() {
    const [openAddShipping, setOpenAddShipping] = useState(false);
    const [loading, setLoading] = useState(true);
    const [shippingOptions, setShippingOptions] = useState([]);
    const [update, forceUpdate] = useReducer((x) => x + 1, 0);

    const handleAddShipping = () => {
        setOpenAddShipping(true);
    };

    const handleDeleteShipping = (id) => {
        dialog.show({
            title: 'Czy napewno chcesz usunąć opcje wysyłki',
            content: 'Ta akcja jest nieodwacalna',
            onConfirm: () => {
                deleteShippingOption(id).then(() => {
                    forceUpdate();
                });
            },
        });
    };

    useEffect(() => {
        getShippingOptions().then((res) => {
            setShippingOptions(res.data);
            setLoading(false);
        });
    }, [update]);

    const renderRow = (elem) => {
        return (
            <ListItem
                component="div"
                secondaryAction={<IconButton onClick={() => handleDeleteShipping(elem.id)}>x</IconButton>}
                key={elem.id}
            >
                <ListItemText>
                    <ListItemText primary={elem.name} secondary={elem.value} />
                </ListItemText>
            </ListItem>
        );
    };

    const renderRowButton = () => {
        return (
            <ListItem component="div" disablePadding>
                <ListItemButton onClick={handleAddShipping}>
                    <ListItemIcon>+</ListItemIcon>
                    <ListItemText primary={`Dodaj wysyłkę`} />
                </ListItemButton>
            </ListItem>
        );
    };

    return (
        <div className="settings-tab-general">
            <AddShipping open={openAddShipping} setOpen={setOpenAddShipping} forceUpdate={forceUpdate} />
            {loading && (
                <div className="settings-tab-loading">
                    <CircularProgress />
                </div>
            )}
            <div>
                <h4>Ustawienia wysyłek</h4>
                <div className="settings-inner-content">
                    <Box
                        sx={{
                            width: '100%',
                            height: '100%',
                            maxWidth: 360,
                            bgcolor: 'background.paper',
                        }}
                    >
                        <div className="settings-shipping-list">
                            {renderRowButton()}
                            <Divider />
                            {shippingOptions.map((elem) => renderRow(elem))}
                        </div>
                    </Box>
                </div>
            </div>
        </div>
    );
}

export default TabShipping;
