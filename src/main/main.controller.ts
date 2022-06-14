import { Controller, Get } from '@nestjs/common';

@Controller()
export class MainController {
  @Get()
  mainMethod() {
    return { message: 'hello andi' };
  }
}
