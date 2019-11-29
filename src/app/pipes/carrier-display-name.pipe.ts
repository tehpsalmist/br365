import { ConstantsService } from '../services/constants.service'
import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'carrierDisplayName'
})
export class CarrierDisplayNamePipe implements PipeTransform {
  constructor(private constants: ConstantsService) {}

  transform(value: any): any {
    return this.constants.carriers[value] || value
  }

}
