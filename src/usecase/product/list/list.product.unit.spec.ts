import ListProductUseCase from './list.product.usecase'
import Product from '../../../domain/product/entity/product'

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  }
}

describe('Unit test list product use case', () => {
  it('should list all products', async () => {
    const productRepository = MockRepository()

    const sut = new ListProductUseCase(productRepository)

    const products = [
      new Product('1', 'Product 1', 100),
      new Product('2', 'Product 2', 200),
    ]

    productRepository.findAll.mockResolvedValue(products)

    const output = await sut.execute()

    expect(output).toEqual({
      products: [
        { id: '1', name: 'Product 1', price: 100 },
        { id: '2', name: 'Product 2', price: 200 },
      ],
    })
  })

  it('should return an empty list if no products are found', async () => {
    const productRepository = MockRepository()

    const sut = new ListProductUseCase(productRepository)

    productRepository.findAll.mockResolvedValue([])

    const output = await sut.execute()

    expect(output).toEqual({
      products: [],
    })
  })
})
