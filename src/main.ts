import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';


/*
-`src/app.module.ts`: Modulo princiapl do aplicativo.
-`src/app.Controler.ts`: Define as rotas e lida com as requisições.
-`src/app.Service.ts`: Contém a lógica de negócio, separando do controlador.

*/
//arquivo que inicia o nosso projeto 
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
