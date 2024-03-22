import axios from 'axios';
import {ArchetypeInterface} from "../../../models/archetype.interface";

class ArchetypeService {

    getArchetypes = async (): Promise<ArchetypeInterface[]> => {
        const resp = await axios.get('http://localhost:3001/archetypes');
        return resp.data;
    };

    getArchetypeByName = async (archetype: string): Promise<ArchetypeInterface> => {
        const resp = await axios.get(`http://localhost:3001/archetypes/${archetype}`);
        return resp.data;
    };

}

export default new ArchetypeService();