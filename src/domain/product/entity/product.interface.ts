import Entity from '../../@shared/entity/entity.abstract'

export default interface ProductInterface extends Entity {
  get id(): string
  get name(): string
  get price(): number
}
