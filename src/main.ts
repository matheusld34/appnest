import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

//arquivo que inicia o nosso projeto 
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
