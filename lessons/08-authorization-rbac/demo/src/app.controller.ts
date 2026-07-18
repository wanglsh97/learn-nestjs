import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getWelcome(): { name: string; message: string } {
    return {
      name: 'knowledge-api',
      message: 'Cumulative NestJS course demo',
    };
  }
}
