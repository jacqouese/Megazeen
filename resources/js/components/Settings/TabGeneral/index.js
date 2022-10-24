import { CircularProgress, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getUserDetailsGeneral } from '../../../api/api';

function TabGeneral() {
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState(' ');
    const [name, setName] = useState(' ');

    useEffect(() => {
        getUserDetailsGeneral().then((res) => {
            setEmail(res.data.email);
            setName(res.data.name);
            setLoading(false);
        });
    }, []);

    return (
        <div className="settings-tab-general">
            {loading && (
                <div className="settings-tab-loading">
                    <CircularProgress />
                </div>
            )}
            <div>
                <h4>Dane konta</h4>
                <div className="settings-inner-content">
                    <TextField
                        label="Adres email"
                        variant="outlined"
                        size="small"
                        value={email}
                    />
                    <TextField
                        label="Nazwa firmy"
                        variant="outlined"
                        size="small"
                        value={name}
                    />
                    <button className="button-primary">Zapisz zmiany</button>
                </div>
            </div>
        </div>
    );
}

export default TabGeneral;
