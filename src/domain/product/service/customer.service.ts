import { v4 as uuid } from 'uuid'
import CustomerRepositoryInterface from '../../customer/repository/customer-repository.interface'
import EventDispatcher from '../../@shared/event/event-dispatcher'
import Customer from '../../customer/entity/customer'
import CustomerCreatedEvent from '../../customer/event/customer-created.event'
import Address from '../../customer/value-object/address'
import CustomerChangeAddressEvent from '../../customer/event/customer-change-address'

export class CustomerService {
  constructor(
    private readonly customerRepository: CustomerRepositoryInterface,
    private readonly eventDispatcher: EventDispatcher,
  ) {}

  async create(name: string): Promise<void> {
    const id = uuid()
    const customer = new Customer(id, name)

    await this.customerRepository.create(customer)
    this.eventDispatcher.notify(new CustomerCreatedEvent(customer))
  }

  async changeAddress(id: string, address: Address): Promise<void> {
    const customer = await this.customerRepository.find(id)
    customer.changeAddress(address)

    await this.customerRepository.update(customer)
    this.eventDispatcher.notify(new CustomerChangeAddressEvent(customer))
  }
}
