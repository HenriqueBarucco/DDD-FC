/* eslint-disable @typescript-eslint/no-explicit-any */

import EventInterface from '../../@shared/event/event.interface'
import Customer from '../entity/customer'

export default class CustomerChangeAddressEvent implements EventInterface {
  dataTimeOccurred: Date
  eventData: Customer

  constructor(eventData: any) {
    this.dataTimeOccurred = new Date()
    this.eventData = eventData
  }
}
