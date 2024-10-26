import EventHandlerInterface from '../../@shared/event-handler.interface'
import CustomerChangeAddressEvent from '../customer-change-address'

export default class SendConsoleLogAddressHandler
  implements EventHandlerInterface<CustomerChangeAddressEvent>
{
  handle({ eventData }: CustomerChangeAddressEvent): void {
    const { id, name, Address } = eventData
    console.log(`Endereço do cliente: ${id}, ${name} alterado para: ${Address}`)
  }
}
