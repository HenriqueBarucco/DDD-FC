import { Sequelize } from 'sequelize-typescript'
import ProductModel from '../../../infrastructure/product/repository/sequelize/product.model'
import ProductRepository from '../../../infrastructure/product/repository/sequelize/product.repository'
import CreateProductUseCase from './create.product.usecase'

describe('Test create product use case', () => {
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

  it('should create a product', async () => {
    const productRepository = new ProductRepository()

    const sut = new CreateProductUseCase(productRepository)

    const input = {
      name: 'Product Name',
      price: 100,
    }

    const output = await sut.execute(input)

    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      price: input.price,
    })

    const createdProduct = await productRepository.find(output.id)

    expect(createdProduct).toBeDefined()
    expect(createdProduct.name).toEqual(input.name)
    expect(createdProduct.price).toEqual(input.price)
  })
})
