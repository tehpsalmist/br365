import { ConstantsService } from '../services/constants.service'
import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'abbrev'
})
export class AbbrevPipe implements PipeTransform {
  constructor (private constantsService: ConstantsService) { }

  transform (value: String): String {
    return this.constantsService.translations.find(t => t.code === value).acronym
  }
}
