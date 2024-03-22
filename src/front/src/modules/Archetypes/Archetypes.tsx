import {MetaShare} from "../Charts/MetaShare";
import {useEffect, useState} from "react";
import ArchetypeService from "../../service/ArchetypeService";
import {ArchetypeInterface} from "../../../../models/archetype.interface";
import {Col, Row, Table} from "react-bootstrap";
import {useGlobalState} from "../../GlobalStateProvider";

export const Archetypes = () => {


    const [data, setData] = useState([] as ArchetypeInterface[]);
    const { state, setState } = useGlobalState();

    const fetchData = async () => {
        try {
            ArchetypeService.getArchetypes()
                .then(archetypes=> {
                    setState({...state, archetypes: archetypes.map(archetype => archetype.name || '')})
                    setData(archetypes)
                });
        } catch (error: any) {
            setData([]);
            console.error(error.message);
        }
    }


    useEffect(() => {
        fetchData()
    }, []);


    return (
        <>
            <Row className={'mt-3'}>
                <Col>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Deck playeds</th>
                                <th>Average position</th>
                                <th>Median position</th>
                            </tr>
                        </thead>
                        <tbody>
                        { data.map((archetype, index) =>
                            <tr key={archetype.name}>
                                <td>{index + 1}</td>
                                <td>{archetype.name}</td>
                                <td>{archetype.qty}</td>
                                <td>{archetype.positionMoyenne}</td>
                                <td>{archetype.positionMediane}</td>
                            </tr>
                        )}

                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Row>
                <Col>
                    <MetaShare data={data}>
                    </MetaShare>
                </Col>

            </Row>
        </>

    );
}