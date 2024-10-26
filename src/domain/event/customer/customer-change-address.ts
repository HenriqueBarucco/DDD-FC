/* eslint-disable @typescript-eslint/no-explicit-any */
import Customer from '../../entity/customer'
import EventInterface from '../@shared/event.interface'

export default class CustomerChangeAddressEvent implements EventInterface {
  dataTimeOccurred: Date
  eventData: Customer

  constructor(eventData: any) {
    this.dataTimeOccurred = new Date()
    this.eventData = eventData
  }
}
