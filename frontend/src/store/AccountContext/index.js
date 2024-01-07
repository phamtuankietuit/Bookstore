import { createContext, useState } from 'react';

const AccountContext = createContext();

function AccountProvider({ children }) {

    const [account, setAccount] = useState();

    const value = {

    };

    return (
        <AccountContext.Provider value={value}>
            {children}
        </AccountContext.Provider>
    );
}

export { AccountContext, AccountProvider };
