import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { PRODUCT_PACKAGE_NAME } from 'clt-jwat-common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: PRODUCT_PACKAGE_NAME,
        url: 'localhost:5678',
        protoPath: 'node_modules/clt-jwat-common/common/protos/product.proto',
      },
    },
  );
  app.listen();
}
bootstrap();
