import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container} from "react-bootstrap";
import {Home} from "./modules/Home/Home";
import {NavTab} from "./modules/Layout/NavTab";
import {GlobalStateProvider} from "./GlobalStateProvider";



function App() {

    return (
        <GlobalStateProvider>
            <Container className={'mt-4'}>
                <NavTab></NavTab>
                <Home></Home>
            </Container>
        </GlobalStateProvider>
    );
}

export default App;
