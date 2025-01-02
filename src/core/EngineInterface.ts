import axios from 'axios';

export default class EngineInterface {
    public constructor(
        public readonly label: string,
        public readonly URL: URL,
    ) {}

    public async sendCommand(command: string) {
        const res = await axios.post<string>(this.URL.toString(), { command });
        return res.data;
    }
}
