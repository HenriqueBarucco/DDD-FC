import Order from '../entity/order'
import OrderItem from '../entity/order_item'
import OrderService from './order.service'

describe('Order Service unit tests', () => {
  it('should get total of all orders', () => {
    const item1 = new OrderItem('1', 'Item 1', 100, '1', 1)
    const item2 = new OrderItem('2', 'Item 2', 200, '2', 2)

    const order1 = new Order('1', '1', [item1])
    const order2 = new Order('2', '2', [item2])

    const total = OrderService.total([order1, order2])

    expect(total).toBe(500)
  })
})
