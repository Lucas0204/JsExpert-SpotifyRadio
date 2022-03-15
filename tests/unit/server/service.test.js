import { jest, expect, describe, test, beforeEach } from '@jest/globals';
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';

import TestUtil from '../_util/testUtil.js';

import { Service } from '../../../server/service.js';


describe('#Service - service test suite', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    })

    test('Get File Stream - should return a file stream and type of file', async () => {
        const service = new Service();
        const readStream = TestUtil.generateReadableStream(['data']);

        const file = '/index.js';

        jest.spyOn(service, service.getFileInfo.name)
            .mockResolvedValue({
                type: '.js',
                name: 'index'
            });

        jest.spyOn(service, service.createFileStream.name)
            .mockReturnValue(readStream);
        
        await service.getFileStream(file);

        expect(service.getFileInfo).toHaveBeenCalledWith(file);
        expect(service.createFileStream).toHaveBeenCalledWith('index');
    })

    test('Get File Info - should return the type of file and file name', async () => {
        const service = new Service();

        const file = '/index.js';
        const fullFilePath = `public${file}`;

        jest.spyOn(path, path.join.name)
            .mockReturnValue(fullFilePath);

        jest.spyOn(path, path.extname.name)
            .mockReturnValue('.js');

        jest.spyOn(fsPromises, fsPromises.access.name)
            .mockImplementation(jest.fn());
        
        const { type, name } = await service.getFileInfo(file);

        expect(path.join).toHaveBeenCalled();
        expect(path.extname).toHaveBeenCalledWith(fullFilePath);
        expect(fsPromises.access).toHaveBeenCalledWith(fullFilePath);
        expect(type).toBe('.js');
        expect(name).toBe(fullFilePath);
    })

    test('Create File Stream - should create and return an read stream', async () => {
        const service = new Service();

        const file = '/index.html';

        const readStream = TestUtil.generateReadableStream([file]);

        jest.spyOn(fs, fs.createReadStream.name)
            .mockReturnValue(readStream);

        const stream = service.createFileStream(file);

        expect(fs.createReadStream).toHaveBeenCalledWith(file);
        expect(stream).toStrictEqual(readStream);
    })
})
