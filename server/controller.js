import { Service } from './service.js';

export class Controller {
    constructor() {
        this.service = new Service();
    }

    async getFileStream(file) {
        return this.service.getFileStream(file);
    }
}
