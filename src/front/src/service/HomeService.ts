import axios from 'axios';

class HomeService {

    getDatas = async (): Promise<any[]> => {
        const resp = await axios.get('http://localhost:3001/data');
        return resp.data;
    };

}

export default new HomeService();