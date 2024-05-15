import { Observable } from 'rxjs';
import { Controller } from '@nestjs/common';

import {
  OrderRequestDto,
  CreateProductDto,
  SearchProductDto,
  UpdateProductDto,
  FindProductByIdDto,
  ProductResponseMessage,
  ProductsResponseMessage,
  ProductServiceController,
  ProductServiceControllerMethods,
} from 'clt-jwat-common';
import { ProductsService } from './products.service';

@Controller()
@ProductServiceControllerMethods()
export class ProductsController implements ProductServiceController {
  constructor(private readonly productsService: ProductsService) {}

  findProductById(
    findProductByIdDto: FindProductByIdDto,
  ):
    | ProductResponseMessage
    | Promise<ProductResponseMessage>
    | Observable<ProductResponseMessage> {
    return this.productsService.findOne(findProductByIdDto.id);
  }

  searchProduct(
    searchProductDto: SearchProductDto,
  ):
    | ProductsResponseMessage
    | Promise<ProductsResponseMessage>
    | Observable<ProductsResponseMessage> {
    return this.productsService.search(searchProductDto);
  }

  createProduct(
    createProductDto: CreateProductDto,
  ):
    | ProductResponseMessage
    | Promise<ProductResponseMessage>
    | Observable<ProductResponseMessage> {
    return this.productsService.create(createProductDto);
  }

  updateProduct(
    updateProductDto: UpdateProductDto,
  ):
    | ProductResponseMessage
    | Promise<ProductResponseMessage>
    | Observable<ProductResponseMessage> {
    return this.productsService.update(updateProductDto);
  }

  removeProduct(
    findProductByIdDto: FindProductByIdDto,
  ):
    | ProductResponseMessage
    | Promise<ProductResponseMessage>
    | Observable<ProductResponseMessage> {
    return this.productsService.remove(findProductByIdDto.id);
  }

  orderRequest(
    orderRequestDto: OrderRequestDto,
  ):
    | ProductsResponseMessage
    | Promise<ProductsResponseMessage>
    | Observable<ProductsResponseMessage> {
    return this.productsService.orderRequest(orderRequestDto);
  }
}
