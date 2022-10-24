import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    InputAdornment,
    TextField,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useEffect } from 'react';
import { useState } from 'react';
import { showSale, updateSale } from '../../../api/api';
import convertFullDateToSqlFormat from '../../../helpers/convertFullDateToSqlFormat';
import today from '../../../helpers/today';
import check from '../../../assets/check.svg';

function EditSale({ open, setOpen, currentId, forceUpdate }) {
    const [toEdit, setToEdit] = useState({
        ProductName: '',
        ProductVariant: '',
        PriceSold: 0,
        Shipping: 0,
        Profit: 0,
        Buyer: '',
        DateSold: today(),
    });
    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {
        updateSale(currentId, toEdit).then((res) => {
            setOpen(false);
            forceUpdate();
        });
    };

    const handleChange = (name, value) => {
        setToEdit({
            ...toEdit,
            [name]: value,
        });
    };

    useEffect(() => {
        if (open === false) return;

        showSale(currentId).then((res) => {
            console.log(res);
            setToEdit(res.data);
        });
    }, [open]);

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Edycja sprzedaży</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">Edytujesz instniejącą sprzedaż</DialogContentText>
                    <div className="edit-sale-input-group" style={{ marginTop: 20 }}>
                        <TextField
                            margin="dense"
                            label="produkt"
                            variant="outlined"
                            size="small"
                            value={toEdit.ProductName}
                            onChange={(e) => handleChange('ProductName', e.target.value)}
                        />
                        <TextField
                            margin="dense"
                            label="wariant"
                            variant="outlined"
                            size="small"
                            helperText="Zmiana pól nie spowoduje zmian w stanie magazynu"
                            fullWidth
                            value={toEdit.ProductVariant}
                            onChange={(e) => handleChange('ProductVariant', e.target.value)}
                        />
                        <div
                            className="invoice-checkbox"
                            id="invoice-edit"
                            style={{ maxWidth: 140, marginTop: 8 }}
                            onClick={(e) => onCheckboxClick(e, 'invoice')}
                        >
                            <span className="checkbox-span">
                                <img className="check-img" src={check} alt="" />
                            </span>
                            <p>faktura</p>
                        </div>
                    </div>

                    <div className="edit-sale-input-group">
                        <TextField
                            margin="dense"
                            fullWidth
                            label="kupujący"
                            variant="outlined"
                            size="small"
                            value={toEdit.Buyer}
                            onChange={(e) => handleChange('Buyer', e.target.value)}
                        />
                        <div style={{ marginTop: 8 }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="data"
                                    value={toEdit.DateSold}
                                    onChange={(newValue) => {
                                        handleChange('DateSold', convertFullDateToSqlFormat(newValue));
                                    }}
                                    renderInput={(params) => <TextField {...params} size="small" />}
                                />
                            </LocalizationProvider>
                        </div>
                    </div>
                    <div className="edit-sale-input-group">
                        <TextField
                            margin="dense"
                            label="cena"
                            variant="outlined"
                            size="small"
                            InputProps={{
                                endAdornment: <InputAdornment position="start">zł</InputAdornment>,
                            }}
                            value={toEdit.PriceSold}
                            onChange={(e) => handleChange('PriceSold', e.target.value)}
                        />
                        <TextField
                            margin="dense"
                            label="wysyłka"
                            variant="outlined"
                            size="small"
                            InputProps={{
                                endAdornment: <InputAdornment position="start">zł</InputAdornment>,
                            }}
                            value={toEdit.Shipping}
                            onChange={(e) => handleChange('Shipping', e.target.value)}
                        />
                        <TextField
                            margin="dense"
                            label="zarobek"
                            variant="outlined"
                            size="small"
                            InputProps={{
                                endAdornment: <InputAdornment position="start">zł</InputAdornment>,
                            }}
                            value={toEdit.Profit}
                            onChange={(e) => handleChange('Profit', e.target.value)}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleClose}>
                        Anuluj
                    </Button>
                    <Button variant="contained" disableElevation onClick={handleSave}>
                        Zapisz zmiany
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default EditSale;
