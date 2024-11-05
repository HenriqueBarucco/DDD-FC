import FindProductUseCase from './find.product.usecase'

const input = {
  id: '123',
}

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  }
}

describe('Unit test find product use case', () => {
  it('should find a product', async () => {
    const productRepository = MockRepository()

    const sut = new FindProductUseCase(productRepository)

    const expectedProduct = {
      id: '123',
      name: 'Product Name',
      price: 100,
    }

    productRepository.find.mockResolvedValue(expectedProduct)

    const output = await sut.execute(input)

    expect(output).toEqual(expectedProduct)
    expect(productRepository.find).toHaveBeenCalledWith(input.id)
  })

  it('should throw an error when product is not found', async () => {
    const productRepository = MockRepository()
    productRepository.find.mockImplementation(() => {
      throw new Error('Product not found')
    })

    const sut = new FindProductUseCase(productRepository)

    await expect(sut.execute(input)).rejects.toThrow('Product not found')
  })
})
