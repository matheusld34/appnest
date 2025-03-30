import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Meu Primeiro Projeto';
  }
  @Get("/teste")
  getTest() {
    return "Rota de teste da api"
  }
}
