import { jest, expect, describe, test, beforeEach } from '@jest/globals';
import config from '../../../server/config.js';
import TestUtil from '../_util/testUtil.js';

import { handler } from '../../../server/routes';
import { Controller } from '../../../server/controller.js';

const {
    pages,
    location,
    constants: {
        CONTENT_TYPE
    }
} = config;

describe('#Routes - test suite for api response', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        jest.clearAllMocks();
    })

    test(`GET / - should redirect to home page`, async () => {
        const params = TestUtil.defaultHandleParams();

        params.request.method = 'GET';
        params.request.url = '/';

        await handler(...params.values());

        expect(params.response.writeHead).toHaveBeenCalledWith(
            302,
            {
                'Location': location.home
            }
        );
        expect(params.response.end).toHaveBeenCalled();
    })

    test(`GET /home - should response with ${pages.homeHTML} file stream`, async () => {
        const params = TestUtil.defaultHandleParams();

        const mockStream = TestUtil.generateReadableStream(['data']);

        params.request.method = 'GET';
        params.request.url = '/home';

        jest.spyOn(Controller.prototype, 'getFileStream')
            .mockResolvedValue({
                stream: mockStream
            });
        
        jest.spyOn(mockStream, 'pipe').mockReturnValue();

        await handler(...params.values());

        expect(Controller.prototype.getFileStream).toHaveBeenCalledWith(pages.homeHTML);
        expect(mockStream.pipe).toHaveBeenCalledWith(params.response);
    })

    test(`GET /controller - should response with ${pages.controllerHTML} file stream`, async () => {
        const params = TestUtil.defaultHandleParams();
        const mockStream = TestUtil.generateReadableStream(['data']);

        params.request.method = 'GET';
        params.request.url = '/controller';

        jest.spyOn(Controller.prototype, 'getFileStream')
            .mockResolvedValue({
                stream: mockStream
            });
        
        jest.spyOn(mockStream, 'pipe').mockReturnValue();

        await handler(...params.values());

        expect(Controller.prototype.getFileStream).toHaveBeenCalledWith(pages.controllerHTML);
        expect(mockStream.pipe).toHaveBeenCalledWith(params.response);
    })

    test(`GET /file.ext - should response with file stream`, async () => {
        const params = TestUtil.defaultHandleParams();
        const mockStream = TestUtil.generateReadableStream(['data']);

        const type = '.js';
        const contentType = CONTENT_TYPE[type];

        params.request.method = 'GET';
        params.request.url = `/file${type}`;

        jest.spyOn(Controller.prototype, 'getFileStream')
            .mockResolvedValue({
                stream: mockStream,
                type
            });

        jest.spyOn(mockStream, 'pipe').mockReturnValue();

        await handler(...params.values());

        expect(Controller.prototype.getFileStream).toHaveBeenCalledWith(params.request.url);
        expect(params.response.writeHead).toHaveBeenCalledWith(
            200,
            {
                'Content-Type': contentType
            }
        );
        expect(mockStream.pipe).toHaveBeenCalledWith(params.response);
    })

    test(`GET /file.ext - should response with file stream`, async () => {
        const params = TestUtil.defaultHandleParams();
        const mockStream = TestUtil.generateReadableStream(['data']);

        const type = '.ext';

        params.request.method = 'GET';
        params.request.url = `/file${type}`;

        jest.spyOn(Controller.prototype, 'getFileStream')
            .mockResolvedValue({
                stream: mockStream,
                type
            });

        jest.spyOn(mockStream, 'pipe').mockReturnValue();

        await handler(...params.values());

        expect(Controller.prototype.getFileStream).toHaveBeenCalledWith(params.request.url);
        expect(params.response.writeHead).not.toHaveBeenCalled();
        expect(mockStream.pipe).toHaveBeenCalledWith(params.response);
    })

    test(`POST /unknow - given an inexistent route should response with 404`, async () => {
        const params = TestUtil.defaultHandleParams();

        params.request.method = 'POST';
        params.request.url = '/unknow';

        await handler(...params.values());

        expect(params.response.writeHead).toHaveBeenCalledWith(404);
        expect(params.response.end).toHaveBeenCalled();
    })

    describe('exceptions', () => {
        test('given inexistent file it should respond with 404', async () => {
            const params = TestUtil.defaultHandleParams();

            params.request.method = 'GET';
            params.request.url = '/index.png';

            jest.spyOn(Controller.prototype, 'getFileStream')
                .mockRejectedValue(new Error('Error: ENOENT - no file found'))

            await handler(...params.values());

            expect(params.response.writeHead).toHaveBeenCalledWith(404);
            expect(params.response.end).toHaveBeenCalled();
        })

        test('given an error it should respond with 500', async () => {
            const params = TestUtil.defaultHandleParams();

            params.request.method = 'GET';
            params.request.url = '/index.png';

            jest.spyOn(Controller.prototype, 'getFileStream')
                .mockRejectedValue(new Error('Error!'))

            await handler(...params.values());

            expect(params.response.writeHead).toHaveBeenCalledWith(500);
            expect(params.response.end).toHaveBeenCalled();
        })
    })
})
