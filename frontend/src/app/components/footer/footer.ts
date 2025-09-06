import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.html',
  styleUrls: ['./footer.css']
})
export class Footer {
  currentYear = signal(new Date().getFullYear());
  footerText = computed(() => `© ${this.currentYear()} Hyacinth Elderly Care. All Rights Reserved.`);
}
