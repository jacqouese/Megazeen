import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { addShippingOption } from '../../../../api/api';
import { createErrorNotification, createNotification } from '../../../../services/notification';

function AddShipping({ open, setOpen, forceUpdate }) {
    const [shippingName, setShippingName] = useState();
    const [shippingValue, setShippingValue] = useState();

    const handleClose = () => {
        setOpen(false);
    };

    const handleAdd = () => {
        addShippingOption(shippingName, shippingValue).then((res) => {
            createNotification({
                title: 'Dodano pomyślnie',
                message: `Opcja wysyłki jest gotowa do użycia`,
                type: 'success',
            });
            forceUpdate();
        });

        setOpen(false);
    };

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Dodaj nową opcję wysyłki</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Wpisz nazwę wysyłki oraz jej wartość
                    </DialogContentText>

                    <TextField
                        margin="dense"
                        label="nazwa wysyłki"
                        variant="outlined"
                        size="small"
                        fullWidth
                        onChange={(e) => setShippingName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="wartość wysyłki"
                        variant="outlined"
                        size="small"
                        type="number"
                        fullWidth
                        onChange={(e) => setShippingValue(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleClose}>
                        Anuluj
                    </Button>
                    <Button variant="contained" disableElevation onClick={handleAdd}>
                        Dodaj wysyłkę
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AddShipping;
