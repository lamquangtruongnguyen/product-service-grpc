import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { PRODUCT_PACKAGE_NAME } from './proto/product';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: PRODUCT_PACKAGE_NAME,
        url: 'localhost:5678',
        protoPath: join(__dirname, '../proto/product.proto'),
        // protoPath: join(
        //   __dirname,
        //   '../../node_modules/clt-jwat-common/common/protos/product.proto',
        // ),
      },
    },
  );
  app.listen();
}
bootstrap();
