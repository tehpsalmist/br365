import { DomSanitizer } from '@angular/platform-browser'
import { MatIconRegistry, MatInput } from '@angular/material'
import { ConstantsService } from '../../services/constants.service'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core'

@Component({
  selector: 'br365-translation',
  templateUrl: './translation.component.html',
  styles: []
})
export class TranslationComponent implements OnInit {

  editing: boolean
  changed: boolean

  @Input() translationCode: string
  @Output() updateTranslation: EventEmitter<{ translation: any }> = new EventEmitter()
  @ViewChild('translationControl') translationControl: MatInput

  translation: any
  translations: any[]

  form: FormGroup

  constructor (
    private constantsService: ConstantsService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    this.iconRegistry.addSvgIcon(
      'translation-outline',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/chrome_reader_mode_outline.svg')
    )
  }

  ngOnInit () {
    this.translations = this.constantsService.translations
    this.translation = this.translations.find(t => t.code === this.translationCode)
    this.form = new FormGroup({
      translation: new FormControl(this.translation.code, Validators.required)
    })
  }

  onEditMode () {
    this.editing = true
    setTimeout(() => {
      this.translationControl.focus()
    }, 0)
  }

  onDoneEditing () {
    if (this.form.valid && this.changed) {
      this.translation = this.translations.find(t => t.code === this.form.get('translation').value)
      this.updateTranslation.emit(this.translation)
      this.editing = false
      this.changed = false
    } else if (this.form.valid) {
      this.editing = false
      this.changed = false
    }
  }
}
