import { Sequelize } from 'sequelize-typescript'
import ProductModel from '../../../infrastructure/product/repository/sequelize/product.model'
import ProductRepository from '../../../infrastructure/product/repository/sequelize/product.repository'
import UpdateProductUseCase from './update.product.usecase'
import Product from '../../../domain/product/entity/product'

describe('Test update product use case', () => {
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

  it('should update a product', async () => {
    const productRepository = new ProductRepository()

    const sut = new UpdateProductUseCase(productRepository)

    const product = new Product('123', 'Old Product Name', 100)
    await productRepository.create(product)

    const input = {
      id: '123',
      name: 'Updated Product Name',
      price: 150,
    }

    const output = await sut.execute(input)

    expect(output).toEqual({
      id: product.id,
      name: input.name,
      price: input.price,
    })

    const updatedProduct = await productRepository.find(product.id)

    expect(updatedProduct.name).toBe(input.name)
    expect(updatedProduct.price).toBe(input.price)
  })
})
