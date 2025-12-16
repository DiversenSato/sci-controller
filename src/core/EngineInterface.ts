import axios from 'axios';
import Player from './Player';

export default class EngineInterface extends Player {
    public constructor(
        label: string,
        public readonly URL: URL
    ) {
        super(label);

        this.pfp = '/robot.jpg';
    }

    public async sendCommand(command: string) {
        const res = await axios.post<string>(this.URL.toString(), { command });
        return res.data;
    }
}
