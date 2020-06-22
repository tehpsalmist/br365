import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor (private snackBar: MatSnackBar) { }

  warn (message: string, duration?: number) {
    this.snackBar.open(message, null, {
      panelClass: [
        'bg-warn',
        'text-white'
      ],
      duration: duration || 2500,
      horizontalPosition: 'right'
    })
  }

  success (message: string, duration?: number) {
    this.snackBar.open(message, null, {
      panelClass: [
        'bg-accent-light',
        'text-accent-dark'
      ],
      duration: duration || 2500,
      horizontalPosition: 'right'
    })
  }
}
