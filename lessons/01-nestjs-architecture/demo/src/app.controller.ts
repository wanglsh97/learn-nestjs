import { Controller, Get } from '@nestjs/common';

interface WelcomeResponse {
  name: string;
  message: string;
  endpoints: string[];
}

@Controller()
export class AppController {
  @Get()
  getWelcome(): WelcomeResponse {
    return {
      name: 'lesson-01-demo',
      message: 'Hello NestJS!',
      endpoints: ['GET /', 'GET /health'],
    };
  }
}
