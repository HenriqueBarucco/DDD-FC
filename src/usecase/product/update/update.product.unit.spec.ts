import UpdateProductUseCase from './update.product.usecase'
import Product from '../../../domain/product/entity/product'

const input = {
  id: '123',
  name: 'Updated Product Name',
  price: 150,
}

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  }
}

describe('Unit test update product use case', () => {
  it('should update a product', async () => {
    const productRepository = MockRepository()
    const updateProductUseCase = new UpdateProductUseCase(productRepository)

    const product = new Product('123', 'Old Product Name', 100)
    productRepository.find.mockResolvedValue(product)

    const output = await updateProductUseCase.execute(input)

    expect(output).toEqual({
      id: product.id,
      name: input.name,
      price: input.price,
    })
    expect(product.name).toBe(input.name)
    expect(product.price).toBe(input.price)
    expect(productRepository.update).toHaveBeenCalledWith(product)
  })

  it('should throw an error when product is not found', async () => {
    const productRepository = MockRepository()
    productRepository.find.mockImplementation(() => {
      throw new Error('Product not found')
    })

    const sut = new UpdateProductUseCase(productRepository)

    await expect(sut.execute(input)).rejects.toThrow('Product not found')
  })
})
