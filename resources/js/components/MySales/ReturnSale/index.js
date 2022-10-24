import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useState } from 'react';
import { addReturn } from '../../../api/api';
import convertFullDateToSqlFormat from '../../../helpers/convertFullDateToSqlFormat';
import today from '../../../helpers/today';
import { createNotification } from '../../../services/notification';

function ReturnSale({ open, setOpen, forceUpdate, currentId }) {
    const [date, setDate] = useState(today());

    const handleClose = () => {
        setOpen(false);
    };

    const handleAdd = () => {
        addReturn(currentId, date)
            .then((res) => {
                forceUpdate();
                if (res.status === 200) {
                    createNotification({
                        title: 'Udało się',
                        message: `Sprzedaż została przeniesiona do zwrotów`,
                        type: 'success',
                    });
                }
            })
            .catch((err) => {
                createNotification({
                    title: 'Coś poszło nie tak',
                    message: `Spróbój ponownie później`,
                    type: 'danger',
                });
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
                <DialogTitle id="alert-dialog-title">Dodaj do zwrotów</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">Wybierz datę zwrotu towaru</DialogContentText>

                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="data zwrotu"
                            value={date}
                            onChange={(newValue) => {
                                setDate(convertFullDateToSqlFormat(newValue));
                            }}
                            renderInput={(params) => <TextField {...params} size="small" style={{ marginTop: 20 }} />}
                        />
                    </LocalizationProvider>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleClose}>
                        Anuluj
                    </Button>
                    <Button variant="contained" disableElevation onClick={handleAdd}>
                        Dodaj zwrot
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ReturnSale;
