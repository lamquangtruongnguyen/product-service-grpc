import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product as ProductEntity } from './entities/product.entity';
import {
  Between,
  DataSource,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Messages } from 'src/constants/messages';
import {
  CreateProductDto,
  OrderRequestDto,
  ProductResponseMessage,
  ProductsResponseMessage,
  SearchProductDto,
  UpdateProductDto,
  Product,
} from 'clt-jwat-common';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private productsRepository: Repository<ProductEntity>,
    private dataSource: DataSource,
  ) {}

  private buildResponseMany(
    code: number,
    message: string = '',
    products: Product[],
  ): ProductsResponseMessage {
    if (message) return { code, message, products };
    return {
      code,
      products,
    };
  }

  private buildResponse(
    code: number,
    message: string = '',
    product: Product,
  ): ProductResponseMessage {
    if (message) return { code, message, product };
    return {
      code,
      product,
    };
  }

  async create(createProductDto: CreateProductDto) {
    const { name, make } = createProductDto;
    const existProduct = await this.productsRepository.find({
      where: { name: ILike(name), make: ILike(make) },
    });
    if (existProduct.length > 0)
      return this.buildResponse(HttpStatus.CONFLICT, Messages.CONFLICT, null);

    const newProduct = this.productsRepository.create(createProductDto);
    const product = await this.productsRepository.save(newProduct);
    return this.buildResponse(HttpStatus.CREATED, Messages.CREATED, product);
  }

  async search(searchProductDto: SearchProductDto) {
    const searchOptions = {};

    for (let field in searchProductDto) {
      if (field !== 'minPrice' && field !== 'maxPrice') {
        searchOptions[field] = ILike(`%${searchProductDto[field]}%`);
      }
      if (field === 'minPrice') {
        const minVal = searchProductDto[field];
        searchOptions['price'] = MoreThanOrEqual(minVal);
      }
      if (field === 'maxPrice') {
        const maxVal = searchProductDto[field];
        if (searchOptions['price'])
          searchOptions['price'] = Between(searchProductDto.minPrice, maxVal);
        else searchOptions['price'] = LessThanOrEqual(maxVal);
      }
    }

    const data = await this.productsRepository.find({
      where: searchOptions,
    });

    if (data.length === 0)
      return this.buildResponseMany(
        HttpStatus.NOT_FOUND,
        Messages.NOT_FOUND,
        [],
      );

    return this.buildResponseMany(HttpStatus.OK, '', data);
  }

  async findOne(id: string) {
    const product = await this.productsRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!product)
      return this.buildResponse(HttpStatus.NOT_FOUND, Messages.NOT_FOUND, null);
    if (product && product.deletedAt)
      return this.buildResponse(
        HttpStatus.NOT_FOUND,
        Messages.NOT_FOUND_DELETED,
        null,
      );
    return this.buildResponse(HttpStatus.OK, '', product);
  }

  async update(updateProductDto: UpdateProductDto) {
    const { id, ...updateProduct } = updateProductDto;
    const productRes = await this.findOne(id);
    if (!productRes.product) return productRes;
    await this.productsRepository.update({ id }, updateProduct);
    return this.buildResponse(HttpStatus.OK, Messages.UPDATED, {
      ...productRes.product,
      ...updateProduct,
    });
  }

  async remove(id: string) {
    const productRes = await this.findOne(id);
    if (!productRes.product) return productRes;
    await this.productsRepository.softDelete(id);
    return this.buildResponse(
      HttpStatus.OK,
      Messages.DELETED,
      productRes.product,
    );
  }

  async orderRequest(
    orderRequestDto: OrderRequestDto,
  ): Promise<ProductsResponseMessage> {
    const { items } = orderRequestDto;

    try {
      const rs = await this.dataSource.manager.transaction(async (manager) => {
        const curProductRepository = manager.getRepository(ProductEntity);
        const updatedProducts: ProductEntity[] = [];
        for (const i of items) {
          const product = await curProductRepository.findOne({
            where: {
              id: i.productId,
            },
          });

          if (!product) throw `${Messages.NOT_FOUND}: ${i.productId}`;

          if (product.quantity === 0)
            throw `${Messages.OOS}: ${product.name} - ${product.id}`;

          if (product.quantity >= i.quantity) {
            await curProductRepository.update(
              { id: i.productId },
              { quantity: product.quantity - i.quantity },
            );
            updatedProducts.push({
              ...product,
              quantity: product.quantity - i.quantity,
              updatedAt: new Date(),
            });
          } else
            throw `${Messages.INSUFFICIENT}: ${product.name} - ${product.id}`;
        }
        return this.buildResponseMany(
          HttpStatus.OK,
          Messages.UPDATED,
          updatedProducts,
        );
      });

      return rs;
    } catch (error) {
      if (typeof error === 'string')
        return {
          code: HttpStatus.BAD_REQUEST,
          message: error,
          products: [],
        };
      else {
        return {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: Messages.INTERNAL_SERVER_ERROR,
          products: [],
        };
      }
    }
  }
}
