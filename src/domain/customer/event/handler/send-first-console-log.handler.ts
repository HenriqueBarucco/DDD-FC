import EventHandlerInterface from '../../../@shared/event/event-handler.interface'
import CustomerCreatedEvent from '../customer-created.event'

export default class SendFirstConsoleLogHandler
  implements EventHandlerInterface<CustomerCreatedEvent>
{
  handle(event: CustomerCreatedEvent): void {
    console.log(
      `Esse é o primeiro console.log do evento: ${event.constructor.name}`,
    )
  }
}
