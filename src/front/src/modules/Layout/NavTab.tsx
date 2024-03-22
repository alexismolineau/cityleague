import Nav from 'react-bootstrap/Nav';
import {NavType} from "../../models/nav.type";
import {useGlobalState} from "../../GlobalStateProvider";
export const NavTab = () => {

    const { setState } = useGlobalState();


    const handleSelect = ($event: string | null) => {
        if ($event) {
            setState({selectedNavTab: $event as NavType});
        }
    };



    return (
        <Nav variant="tabs" defaultActiveKey="home" onSelect={handleSelect}>
            <Nav.Item>
                <Nav.Link eventKey="home" >Home</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="archetypes">Archetypes</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="archetype">Archetype</Nav.Link>
            </Nav.Item>
        </Nav>
    );
}