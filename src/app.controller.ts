import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {

    @Get()
    getHello(): string {
        return 'Hello and welcome to Associations API! Please use http://localhost:3000/api to access the API.';
    }
}
