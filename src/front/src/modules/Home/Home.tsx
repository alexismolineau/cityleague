import {MetaShare} from "../Charts/MetaShare";
import {useGlobalState} from "../../GlobalStateProvider";
import {Archetypes} from "../Archetypes/Archetypes";
import {Archetype} from "../Archetype/Archetype";

export const Home = () => {

    const { state } = useGlobalState();


    return (
        <>
            {state.selectedNavTab === 'home' ? 'Vide': <></>}
            {state.selectedNavTab === 'archetype' ? <Archetype></Archetype> : <></>}
            {state.selectedNavTab === 'archetypes' ? <Archetypes></Archetypes> : <></>}
        </>
    );
}