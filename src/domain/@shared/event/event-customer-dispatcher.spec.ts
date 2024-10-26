import Customer from '../../customer/entity/customer'
import CustomerChangeAddressEvent from '../../customer/event/customer-change-address'
import CustomerCreatedEvent from '../../customer/event/customer-created.event'
import SendConsoleLogAddressHandler from '../../customer/event/handler/send-console-log-address.handler'
import SendFirstConsoleLogHandler from '../../customer/event/handler/send-first-console-log.handler'
import SendSecondConsoleLogHandler from '../../customer/event/handler/send-second-console-log.handler'
import Address from '../../customer/value-object/address'
import EventDispatcher from './event-dispatcher'

describe('Customer Domain events tests', () => {
  it('should register an event handler', () => {
    const eventDispatcher = new EventDispatcher()
    const sendFirstConsoleLogHandler = new SendFirstConsoleLogHandler()
    const sendSecondConsoleLogHandler = new SendSecondConsoleLogHandler()

    const sendConsoleLogAddressHandler = new SendConsoleLogAddressHandler()

    eventDispatcher.register(
      CustomerCreatedEvent.name,
      sendFirstConsoleLogHandler,
    )

    eventDispatcher.register(
      CustomerCreatedEvent.name,
      sendSecondConsoleLogHandler,
    )

    eventDispatcher.register(
      CustomerChangeAddressEvent.name,
      sendConsoleLogAddressHandler,
    )

    expect(
      eventDispatcher.getEventHandlers[CustomerCreatedEvent.name],
    ).toBeDefined()

    expect(
      eventDispatcher.getEventHandlers[CustomerCreatedEvent.name].length,
    ).toBe(2)

    expect(
      eventDispatcher.getEventHandlers[CustomerCreatedEvent.name][0],
    ).toMatchObject(sendFirstConsoleLogHandler)

    expect(
      eventDispatcher.getEventHandlers[CustomerCreatedEvent.name][1],
    ).toMatchObject(sendSecondConsoleLogHandler)

    expect(
      eventDispatcher.getEventHandlers[CustomerChangeAddressEvent.name],
    ).toBeDefined()

    expect(
      eventDispatcher.getEventHandlers[CustomerChangeAddressEvent.name].length,
    ).toBe(1)

    expect(
      eventDispatcher.getEventHandlers[CustomerChangeAddressEvent.name][0],
    ).toMatchObject(sendConsoleLogAddressHandler)
  })

  it('should unregister an event handler', () => {
    const eventDispatcher = new EventDispatcher()
    const sendFirstConsoleLogHandler = new SendFirstConsoleLogHandler()
    const sendSecondConsoleLogHandler = new SendSecondConsoleLogHandler()

    const sendConsoleLogAddressHandler = new SendConsoleLogAddressHandler()

    eventDispatcher.register(
      CustomerCreatedEvent.name,
      sendFirstConsoleLogHandler,
    )

    eventDispatcher.register(
      CustomerCreatedEvent.name,
      sendSecondConsoleLogHandler,
    )

    eventDispatcher.register(
      CustomerChangeAddressEvent.name,
      sendConsoleLogAddressHandler,
    )

    expect(
      eventDispatcher.getEventHandlers[CustomerCreatedEvent.name][0],
    ).toMatchObject(sendFirstConsoleLogHandler)

    expect(
      eventDispatcher.getEventHandlers[CustomerCreatedEvent.name][1],
    ).toMatchObject(sendSecondConsoleLogHandler)

    expect(
      eventDispatcher.getEventHandlers[CustomerChangeAddressEvent.name][0],
    ).toMatchObject(sendConsoleLogAddressHandler)

    eventDispatcher.unregister(
      CustomerCreatedEvent.name,
      sendFirstConsoleLogHandler,
    )

    eventDispatcher.unregister(
      CustomerCreatedEvent.name,
      sendSecondConsoleLogHandler,
    )

    eventDispatcher.unregister(
      CustomerChangeAddressEvent.name,
      sendConsoleLogAddressHandler,
    )

    expect(
      eventDispatcher.getEventHandlers[CustomerCreatedEvent.name],
    ).toBeDefined()

    expect(
      eventDispatcher.getEventHandlers[CustomerCreatedEvent.name].length,
    ).toBe(0)

    expect(
      eventDispatcher.getEventHandlers[CustomerChangeAddressEvent.name],
    ).toBeDefined()

    expect(
      eventDispatcher.getEventHandlers[CustomerChangeAddressEvent.name].length,
    ).toBe(0)
  })

  it('should unregister all event handlers', () => {
    const eventDispatcher = new EventDispatcher()

    const sendFirstConsoleLogHandler = new SendFirstConsoleLogHandler()
    const sendSecondConsoleLogHandler = new SendSecondConsoleLogHandler()

    const sendConsoleLogAddressHandler = new SendConsoleLogAddressHandler()

    eventDispatcher.register(
      CustomerCreatedEvent.name,
      sendFirstConsoleLogHandler,
    )

    eventDispatcher.register(
      CustomerCreatedEvent.name,
      sendSecondConsoleLogHandler,
    )

    eventDispatcher.register(
      CustomerChangeAddressEvent.name,
      sendConsoleLogAddressHandler,
    )

    expect(
      eventDispatcher.getEventHandlers[CustomerCreatedEvent.name][0],
    ).toMatchObject(sendFirstConsoleLogHandler)

    expect(
      eventDispatcher.getEventHandlers[CustomerCreatedEvent.name][1],
    ).toMatchObject(sendSecondConsoleLogHandler)

    expect(
      eventDispatcher.getEventHandlers[CustomerChangeAddressEvent.name][0],
    ).toMatchObject(sendConsoleLogAddressHandler)

    eventDispatcher.unregisterAll()

    expect(
      eventDispatcher.getEventHandlers[CustomerCreatedEvent.name],
    ).toBeUndefined()
    expect(
      eventDispatcher.getEventHandlers[CustomerChangeAddressEvent.name],
    ).toBeUndefined()
  })

  it('should notify all event handlers', () => {
    const eventDispatcher = new EventDispatcher()

    const sendFirstConsoleLogHandler = new SendFirstConsoleLogHandler()
    const sendSecondConsoleLogHandler = new SendSecondConsoleLogHandler()

    const sendConsoleLogAddressHandler = new SendConsoleLogAddressHandler()

    const spyEventHandler1 = jest.spyOn(sendFirstConsoleLogHandler, 'handle')
    const spyEventHandler2 = jest.spyOn(sendSecondConsoleLogHandler, 'handle')
    const spyEventHandler3 = jest.spyOn(sendConsoleLogAddressHandler, 'handle')

    eventDispatcher.register(
      CustomerCreatedEvent.name,
      sendFirstConsoleLogHandler,
    )

    eventDispatcher.register(
      CustomerCreatedEvent.name,
      sendSecondConsoleLogHandler,
    )

    eventDispatcher.register(
      CustomerChangeAddressEvent.name,
      sendConsoleLogAddressHandler,
    )

    expect(
      eventDispatcher.getEventHandlers[CustomerCreatedEvent.name][0],
    ).toMatchObject(sendFirstConsoleLogHandler)

    expect(
      eventDispatcher.getEventHandlers[CustomerCreatedEvent.name][1],
    ).toMatchObject(sendSecondConsoleLogHandler)

    expect(
      eventDispatcher.getEventHandlers[CustomerChangeAddressEvent.name][0],
    ).toMatchObject(sendConsoleLogAddressHandler)

    const customer = new Customer('c1', 'Customer 1')
    const customerCreatedEvent = new CustomerCreatedEvent(null)

    const address = new Address('street', 30, '00000-000', 'city')

    customer.changeAddress(address)

    const customerChangeAddressEvent = new CustomerChangeAddressEvent(customer)

    eventDispatcher.notify(customerCreatedEvent)
    eventDispatcher.notify(customerChangeAddressEvent)

    expect(spyEventHandler1).toHaveBeenCalled()
    expect(spyEventHandler2).toHaveBeenCalled()
    expect(spyEventHandler3).toHaveBeenCalled()
  })
})
