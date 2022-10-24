import { useEffect, useState } from 'react';
import TabFees from '../components/Settings/TabFees';
import TabGeneral from '../components/Settings/TabGeneral';
import TabPassword from '../components/Settings/TabPassword';
import settingsImg from '../assets/settingsImage.svg';
import TabShipping from '../components/Settings/TabShipping';

function Settings() {
    const [activeTab, setActiveTab] = useState('general');

    useEffect(() => {
        const tabs = document.querySelectorAll(`[data-tab]`);

        tabs.forEach((tab) => {
            tab.classList.remove('active');
        });
        const tabToActivate = document.querySelector(`[data-tab="${activeTab}"]`);
        tabToActivate.classList.add('active');
    }, [activeTab]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const renderTab = () => {
        if (activeTab == 'general') {
            return <TabGeneral />;
        } else if (activeTab == 'password') {
            return <TabPassword />;
        } else if (activeTab == 'costs') {
            return <TabFees />;
        } else if (activeTab == 'shipping') {
            return <TabShipping />;
        }
    };

    return (
        <div className="my-sales">
            <div className="my-sales-inner">
                <div className="add-warehouse-container inner-container inner-info-container">
                    <div>
                        <h3>Ustawienia konta</h3>
                        <br />
                        <p>Zmień swoje dane, kosza oraz zarządzaj kontem.</p>
                    </div>
                    <img src={settingsImg} alt="" style={{ width: 180 }} />
                </div>
                <div className="sale-list-container inner-container">
                    <div className="settings-inner">
                        <div className="settings-side-bar">
                            <ul>
                                <li data-tab="general" onClick={() => handleTabChange('general')}>
                                    Ustawienia ogólne
                                </li>
                                <li data-tab="password" onClick={() => handleTabChange('password')}>
                                    Hasło
                                </li>
                                <li data-tab="costs" onClick={() => handleTabChange('costs')}>
                                    Koszty
                                </li>
                                <li data-tab="shipping" onClick={() => handleTabChange('shipping')}>
                                    Wysyłki
                                </li>
                            </ul>
                        </div>
                        <div className="settings-inner-right">{renderTab()}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;
