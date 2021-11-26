import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

import "bootstrap/dist/css/bootstrap.min.css";
import {PublicClientApplication} from "@azure/msal-browser";
import {
    AuthenticatedTemplate,
    MsalProvider,
    UnauthenticatedTemplate,
    useIsAuthenticated,
    useMsal
} from "@azure/msal-react";
import Button from "react-bootstrap/Button";

import {loginRequest, msalConfig} from "./authConfig";

const msalInstance = new PublicClientApplication(msalConfig);

const SignInButton = () => {
    const {instance, accounts} = useMsal();
    const isAuthenticated = useIsAuthenticated();

    const handleLogin = (instance) => {
        instance
            .loginPopup(loginRequest)
            // .loginRedirect(loginRequest)
            .then((res) => {
                console.log('loginPopup: ', res);
            })
            .catch(err => {
                console.log('error => ', err)
            });
    }

    return (
        <>
            <Button variant="secondary" className="ml-auto" onClick={() => handleLogin(instance)}>Sign In using
                Popup</Button>
            <pre>{JSON.stringify({isAuthenticated}, null, 2)}</pre>
        </>
    );
};

const SignOutButton = () => {
    const {instance} = useMsal();
    const isAuthenticated = useIsAuthenticated();

    const handleLogin = (instance) => {
        instance
            .logoutPopup()
            // .logoutRedirect()
            .catch(err => {
                console.log('error => ', err)
            });
    }

    return (
        <>
            <Button variant="secondary" className="ml-auto" onClick={() => handleLogin(instance)}>Sign Out using
                Popup</Button>
            <pre>{JSON.stringify({isAuthenticated}, null, 2)}</pre>
        </>
    );
};

const RequestProfile = () => {
    const {instance, accounts} = useMsal();
    const [data, setData] = useState();

    const handleRequest = (instance) => {
        const activeAccount = instance.getActiveAccount();
        console.log(activeAccount);
        instance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0]
        }).then((res) => {
            console.log('acquireTokenSilent', res);
            setData(res);
        });
    }

    return (
        <>
            <Button variant="secondary" className="ml-auto" onClick={() => handleRequest(instance)}>Request
                Profile</Button>
            <pre>{JSON.stringify({data}, null, 2)}</pre>
        </>
    );
};

ReactDOM.render(
    <React.StrictMode>
        <MsalProvider instance={msalInstance}>
            {/* <App /> */}
            <UnauthenticatedTemplate>
                <SignInButton/>
            </UnauthenticatedTemplate>
            <AuthenticatedTemplate>
                <RequestProfile/>
                <SignOutButton/>
            </AuthenticatedTemplate>
        </MsalProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
