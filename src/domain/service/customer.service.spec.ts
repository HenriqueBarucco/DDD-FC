import CustomerRepositoryInterface from '../repository/customer-repository.interface'
import EventDispatcher from '../event/@shared/event-dispatcher'
import CustomerCreatedEvent from '../event/customer/customer-created.event'
import SendFirstConsoleLogHandler from '../event/customer/handler/send-first-console-log.handler'
import SendSecondConsoleLogHandler from '../event/customer/handler/send-second-console-log.handler'
import { v4 as uuid } from 'uuid'
import Customer from '../entity/customer'
import CustomerChangeAddressEvent from '../event/customer/customer-change-address'
import { CustomerService } from './customer.service'
import Address from '../entity/address'
import SendConsoleLogAddressHandler from '../event/customer/handler/send-console-log-address.handler'

jest.mock('uuid')
const mockUuid = uuid as jest.Mock

describe('Customer Service with event handlers', () => {
  let customerService: CustomerService
  let customerRepository: jest.Mocked<CustomerRepositoryInterface>
  let eventDispatcher: EventDispatcher

  beforeEach(() => {
    customerRepository = {
      create: jest.fn(),
      update: jest.fn(),
      find: jest.fn(),
      findAll: jest.fn(),
    }
    eventDispatcher = new EventDispatcher()
    customerService = new CustomerService(customerRepository, eventDispatcher)
    mockUuid.mockReturnValue('test-uuid')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should create a customer, save it, and trigger both event handlers', async () => {
    const customerName = 'John Doe'

    const firstHandler = new SendFirstConsoleLogHandler()
    const secondHandler = new SendSecondConsoleLogHandler()

    const firstHandlerSpy = jest.spyOn(firstHandler, 'handle')
    const secondHandlerSpy = jest.spyOn(secondHandler, 'handle')

    eventDispatcher.register(CustomerCreatedEvent.name, firstHandler)
    eventDispatcher.register(CustomerCreatedEvent.name, secondHandler)

    await customerService.create(customerName)

    expect(customerRepository.create).toHaveBeenCalledTimes(1)
    expect(customerRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'test-uuid',
        name: customerName,
      }),
    )

    expect(firstHandlerSpy).toHaveBeenCalledTimes(1)
    expect(secondHandlerSpy).toHaveBeenCalledTimes(1)

    const event = firstHandlerSpy.mock.calls[0][0] as CustomerCreatedEvent
    expect(event.eventData).toEqual(
      expect.objectContaining({
        id: 'test-uuid',
        name: customerName,
      }),
    )
  })

  it('should change the address, update the repository, and dispatch CustomerChangeAddressEvent', async () => {
    const initialAddress = new Address('Street 1', 1, '12345-123', 'City')
    const updatedAddress = new Address('Street 2', 2, '00000-000', 'City')

    const customerId = '1'

    const customer = new Customer(customerId, 'John Doe')
    customer.changeAddress(initialAddress)

    customerRepository.find.mockResolvedValue(customer)

    const logHandler = new SendConsoleLogAddressHandler()
    const logHandlerSpy = jest.spyOn(logHandler, 'handle')
    eventDispatcher.register(CustomerChangeAddressEvent.name, logHandler)

    await customerService.changeAddress(customerId, updatedAddress)

    expect(customerRepository.find).toHaveBeenCalledWith(customerId)
    expect(customerRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({ _address: updatedAddress }),
    )

    expect(logHandlerSpy).toHaveBeenCalledTimes(1)

    const event = logHandlerSpy.mock.calls[0][0] as CustomerChangeAddressEvent
    expect(event.eventData).toEqual(expect.objectContaining(customer))
  })
})
