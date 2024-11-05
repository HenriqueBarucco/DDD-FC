import { Sequelize } from 'sequelize-typescript'
import ProductModel from '../../../infrastructure/product/repository/sequelize/product.model'
import ProductRepository from '../../../infrastructure/product/repository/sequelize/product.repository'
import ListProductUseCase from './list.product.usecase'
import Product from '../../../domain/product/entity/product'

describe('Test list product use case', () => {
  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    })

    await sequelize.addModels([ProductModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it('should list all products', async () => {
    const productRepository = new ProductRepository()

    const sut = new ListProductUseCase(productRepository)

    const product1 = new Product('1', 'Product 1', 100)
    const product2 = new Product('2', 'Product 2', 200)
    await productRepository.create(product1)
    await productRepository.create(product2)

    const output = await sut.execute()

    expect(output).toEqual({
      products: [
        { id: '1', name: 'Product 1', price: 100 },
        { id: '2', name: 'Product 2', price: 200 },
      ],
    })
  })

  it('should return an empty list if no products are found', async () => {
    const productRepository = new ProductRepository()

    const sut = new ListProductUseCase(productRepository)

    const output = await sut.execute()

    expect(output).toEqual({
      products: [],
    })
  })
})
