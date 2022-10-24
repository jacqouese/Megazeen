import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import dialog from '../../../services/dialog';

function ConfirmDialog() {
    const [open, setOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogContent, setDialogContent] = useState('');
    const [confirmButton, setConfirmButton] = useState({
        label: 'tak',
        action: () => null,
    });

    const handleClose = () => {
        setOpen(false);
    };

    const showDialog = ({ title, content, onConfirm }) => {
        setDialogTitle(title);
        setDialogContent(content);
        setConfirmButton({
            label: 'tak',
            action: () => {
                onConfirm();
                setOpen(false);
            },
        });

        setOpen(true);
    };

    useEffect(() => {
        dialog.register(showDialog);
    }, []);

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {dialogContent}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleClose}>
                        Nie
                    </Button>
                    <Button
                        variant="contained"
                        disableElevation
                        onClick={confirmButton.action}
                    >
                        Tak
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ConfirmDialog;
