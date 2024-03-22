import {Card, Col, Form, Row, Table} from "react-bootstrap";
import {ChangeEvent, useEffect, useState} from "react";
import {ArchetypeInterface} from "../../../../models/archetype.interface";
import ArchetypeService from "../../service/ArchetypeService";
import {CardsBar} from "../Charts/CardsBar";

export const Archetype = () => {

    const [data, setData] = useState([] as ArchetypeInterface[]);
    const [archetype, setArchetype] = useState({} as ArchetypeInterface);


    const fetchData = async () => {
        try {
            ArchetypeService.getArchetypes()
                .then(archetypes=> {
                    setData(archetypes)
                });
        } catch (error: any) {
            setData([]);
            console.error(error.message);
        }
    }
    const fetchArchetype = async ($event: ChangeEvent<HTMLSelectElement>) => {
        try {
            ArchetypeService.getArchetypeByName($event.target.value)
                .then(archetype=> setArchetype(archetype));
        } catch (error: any) {
            setArchetype({});
            console.error(error.message);
        }
    }

    useEffect(() => {
        fetchData()
    }, []);




    return (
        <>
            <Row className={'mt-3'}>
                <Form.Select onChange={fetchArchetype}>
                    { data?.map((archetype, index) =>
                        <option value={archetype?.name} key={archetype?.name}>
                            {archetype?.name}
                        </option>
                    )}
                </Form.Select>
            </Row>
            <Row className={'mt-3'}>
                <Card className={'py-3 px-4'}>
                    <div className={'d-flex justify-content-between'}>
                        <div>
                            <span>
                                Name :
                            </span>
                            <span className={'fw-bold'}>
                                {archetype?.name}
                            </span>
                        </div>
                        <div>
                            <span>
                                Played :
                            </span>
                            <span className={'fw-bold'}>
                                {archetype?.qty}
                            </span>
                        </div>
                        <div>
                            <span>
                                Average position :
                            </span>
                            <span className={'fw-bold'}>
                                {archetype?.positionMoyenne}
                            </span>
                        </div>

                    </div>
                </Card>

            </Row>
            {
                data ?
                    <Row className={'mt-3'}>
                        <Col>
                            <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Set</th>
                                    <th>Average quantity</th>
                                </tr>
                                </thead>
                                <tbody>
                                {archetype?.cards?.map((card, index) =>
                                    <tr key={card.set}>
                                    <td>{index + 1}</td>
                                    <td>{card.name}</td>
                                    <td>{card.set}</td>
                                    <td>{card.quantity}</td>
                                </tr>
                            )}
                            </tbody>
                        </Table>
                    </Col>
                </Row>

                : <></>
            }
            <CardsBar data={archetype?.cards}></CardsBar>
        </>
    );
}