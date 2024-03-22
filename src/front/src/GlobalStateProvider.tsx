import React, { createContext, useState, useContext, Dispatch, SetStateAction } from "react";
import {NavType} from "./models/nav.type";

export interface GlobalStateInterface {
    selectedNavTab: NavType;
    archetypes: string[];
}

const GlobalStateContext = createContext({
    state: {selectedNavTab: 'home', archetypes: []} as Partial<GlobalStateInterface>,
    setState: {} as Dispatch<SetStateAction<Partial<GlobalStateInterface>>>,
});

const GlobalStateProvider = ({
                                 children,
                                 value = {} as GlobalStateInterface,
                             }: {
    children: React.ReactNode;
    value?: Partial<GlobalStateInterface>;
}) => {
    const [state, setState] = useState(value);
    return (
        <GlobalStateContext.Provider value={{ state, setState }}>
            {children}
        </GlobalStateContext.Provider>
    );
};

const useGlobalState = () => {
    const context = useContext(GlobalStateContext);
    if (!context) {
        throw new Error("useGlobalState must be used within a GlobalStateContext");
    }
    return context;
};

export { GlobalStateProvider, useGlobalState };