import Address from './entity/address'
import Customer from './entity/customer'
import Order from './entity/order'
import OrderItem from './entity/order_item'

const customer = new Customer(
  '1',
  'John Doe',
  new Address('123 Main St', 1, 'Springfield', 'USA'),
)

customer.activate()

const item1 = new OrderItem('1', 'Laptop', 1000)
const item2 = new OrderItem('2', 'Mouse', 20)

const order = new Order('1', customer._id, [item1, item2])
console.log(order)
