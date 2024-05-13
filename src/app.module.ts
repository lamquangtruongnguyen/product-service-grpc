import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ProductsModule,
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',
    //   port: 54321,
    //   username: 'postgres',
    //   password: 'postgres',
    //   database: 'product',
    //   entities: [__dirname + '/**/*.entity{.ts,.js}'],
    //   synchronize: true,
    // }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: 'postgres://testuser:T0vXlHX23vu6TCrTnvqiSYW5HlkLNRsz@dpg-cou789ol5elc73c6mfm0-a.singapore-postgres.render.com/product_y17r',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      ssl: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
