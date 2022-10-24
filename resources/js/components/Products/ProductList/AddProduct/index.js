import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { addProduct, addVariant } from '../../../../api/api';
import baseURL from '../../../../api/baseURL';
import { createErrorNotification } from '../../../../services/notification';

function AddProduct({ open, setOpen, forceUpdate, isVariant, variantId }) {
    const [name, setName] = useState('');
    const [title, setTitle] = useState({ title: '', subtitle: '', input: '' });

    const [fileName, setFileName] = useState('');
    const [image, setImage] = useState(null);
    const onDrop = useCallback((acceptedFiles) => {
        setFileName(acceptedFiles[0].name);
        setImage(acceptedFiles[0]);
    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const handleClose = () => {
        setOpen(false);
        setFileName('');
        setImage(null);
    };

    const handleAdd = () => {
        if (isVariant === false) {
            addProduct(name).then((res) => {
                console.log(res);
                forceUpdate();
            });
        } else {
            addVariant(variantId, name, image)
                .then((res) => {
                    forceUpdate();
                })
                .catch((err) => {
                    createErrorNotification({ statusCode: err.response.status });
                });
        }
        setOpen(false);
        setFileName('');
        setImage(null);
    };

    useEffect(() => {
        const descProduct =
            'Wpisz nazwę produktu jaka będzie wyświetlana, w kolejnym kroku będziesz mógł dodać warianty do produktu.';
        const descVariant =
            'Wpisz nazwę wariantu, który chcesz dodać, opcjonalnie możesz dodać zdjęcie, które bedzie wyświetlanie obok wariantu.';
        setTitle(
            isVariant
                ? { title: 'Dodaj nowy wariant', subtitle: descVariant, input: 'nazwa wariantu' }
                : { title: 'Dodaj nowy produkt', subtitle: descProduct, input: 'nazwa produktu' }
        );
    }, [open]);

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{title.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">{title.subtitle}</DialogContentText>
                    <TextField
                        margin="dense"
                        autoFocus
                        fullWidth
                        label={title.input}
                        variant="outlined"
                        size="small"
                        style={{ marginTop: 20 }}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {isVariant && (
                        <div
                            {...getRootProps()}
                            className={`dropzone-container ${isDragActive && 'dropzone-container-active'}`}
                        >
                            <input {...getInputProps()} />
                            <img src={baseURL + '/images/no-img.png'} alt="" />
                            {isDragActive ? (
                                <p>upuść zdjęcie</p>
                            ) : fileName.length > 0 ? (
                                <p>{fileName}</p>
                            ) : (
                                <p>naciśnij lub przeciągnij zdjęcie tutaj</p>
                            )}
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleClose}>
                        Anuluj
                    </Button>
                    <Button variant="contained" disableElevation onClick={handleAdd}>
                        Dodaj
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AddProduct;
