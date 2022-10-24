import { CircularProgress, InputAdornment, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getUserFees, updateUserFees } from '../../../api/api';

function TabFees() {
    const [loading, setLoading] = useState(true);
    const [fees, setFees] = useState({
        standard_fee: 0,
        featured_fee: 0,
        sale_fee: 0,
        tax_rate: 0,
    });

    useEffect(() => {
        getUserFees().then((res) => {
            const formatedFees = {};
            for (const [key, value] of Object.entries(res.data)) {
                formatedFees[key] = value * 100;
            }
            setFees(formatedFees);
            setLoading(false);
        });
    }, []);

    const onChangeFee = (fee, value) => {
        setFees({ ...fees, [fee]: value });
    };

    const onSubmit = () => {
        const formatedFees = {};
        for (const [key, value] of Object.entries(fees)) {
            formatedFees[key] = value / 100;
        }
        updateUserFees(formatedFees).then((res) => {
            console.log(res);
        });
    };

    return (
        <div className="settings-tab-general">
            {loading && (
                <div className="settings-tab-loading">
                    <CircularProgress />
                </div>
            )}
            <div>
                <h4>Zmień prowizje</h4>
                <div className="settings-inner-content settings-inner-fees">
                    <TextField
                        label="prowizja standard"
                        sx={{ m: 1, width: '25ch' }}
                        size="small"
                        value={fees.standard_fee}
                        helperText="Prowizja liczona jest od ceny sprzedaży"
                        onChange={(e) => onChangeFee('standard_fee', e.target.value)}
                        type="number"
                        InputProps={{
                            startAdornment: <InputAdornment position="start">%</InputAdornment>,
                        }}
                    />
                    <div>
                        <TextField
                            label="prowizja wyróżnienie"
                            sx={{ m: 1, width: '12ch' }}
                            size="small"
                            value={fees.featured_fee}
                            helperText="z prowizji standard"
                            onChange={(e) => onChangeFee('featured_fee', e.target.value)}
                            type="number"
                            InputProps={{
                                startAdornment: <InputAdornment position="start">%</InputAdornment>,
                            }}
                        />
                        <TextField
                            label="wyprzedaż"
                            sx={{ m: 1, width: '11.5ch' }}
                            size="small"
                            value={fees.sale_fee}
                            onChange={(e) => onChangeFee('sale_fee', e.target.value)}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">%</InputAdornment>,
                            }}
                        />
                    </div>
                    <TextField
                        label="podatek dochodowy"
                        sx={{ m: 1, width: '25ch' }}
                        size="small"
                        value={fees.tax_rate}
                        onChange={(e) => onChangeFee('tax_rate', e.target.value)}
                        type="number"
                        InputProps={{
                            startAdornment: <InputAdornment position="start">%</InputAdornment>,
                        }}
                    />
                    <button className="button-primary" onClick={onSubmit}>
                        Zapisz zmiany
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TabFees;
