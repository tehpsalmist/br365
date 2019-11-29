import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'display'
})
export class BookDisplayNamePipe implements PipeTransform {
  transform(value: string): string {
    return value === 'SongofSolomon'
      ? 'Song of Solomon'
      : value && value.match(/^\d/)
        ? `${value[0]} ${value.slice(1)}`
        : value
  }
}
