import Customer from '../entity/customer'
import { v4 as uuid } from 'uuid'
import CustomerRepositoryInterface from '../repository/customer-repository.interface'
import EventDispatcher from '../event/@shared/event-dispatcher'
import CustomerCreatedEvent from '../event/customer/customer-created.event'
import CustomerChangeAddressEvent from '../event/customer/customer-change-address'
import Address from '../entity/address'

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
