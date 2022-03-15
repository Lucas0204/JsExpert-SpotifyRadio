import { beforeEach, describe, test, expect, jest } from '@jest/globals';

import TestUtil from '../_util/testUtil.js';

import { Controller } from '../../../server/controller.js';
import { Service } from '../../../server/service.js';

describe('#Controller - controller test suite', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    })

    test('Get File Stream - should return a file stream and type of file', async () => {
        const controller = new Controller();
        const stream = TestUtil.generateReadableStream(['data']);
        const mockFileStream = {
            stream,
            type: '.js'
        };

        const file = 'index.js';

        jest.spyOn(Service.prototype, Service.prototype.getFileStream.name)
            .mockResolvedValue(mockFileStream);

        const fileStream = await controller.getFileStream(file);

        expect(Service.prototype.getFileStream).toHaveBeenCalledWith(file);
        expect(fileStream).toEqual(mockFileStream);
    })
})
