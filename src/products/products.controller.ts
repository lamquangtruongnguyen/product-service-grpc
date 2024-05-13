import { Controller } from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  CreateProductDto,
  FindProductByIdDto,
  OrderRequestDto,
  ProductServiceController,
  ProductServiceControllerMethods,
  ProductResponseMessage,
  ProductsResponseMessage,
  SearchProductDto,
  UpdateProductDto,
} from 'src/proto/product';
import { Observable } from 'rxjs';
// import {
//   CreateProductDto,
//   FindProductByIdDto,
//   OrderRequestDto,
//   ProductResponseMessage,
//   ProductServiceController,
//   ProductServiceControllerMethods,
//   ProductsResponseMessage,
//   SearchProductDto,
//   UpdateProductDto,
// } from 'clt-jwat-common';

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
    | ProductResponseMessage
    | Promise<ProductResponseMessage>
    | Observable<ProductResponseMessage> {
    return this.productsService.orderRequest(orderRequestDto);
  }
}
