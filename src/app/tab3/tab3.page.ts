import { Component, OnInit } from '@angular/core';
import { EldenringService } from '../services/eldenring.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page implements OnInit {
  bosses: any[] = [];
  filteredBosses: any[] = [];
  searchTerm: string = '';

  constructor(private eldenringService: EldenringService) {}

  ngOnInit() {
    this.eldenringService.getAllBosses().subscribe((response: any[]) => {
      this.bosses = response;
      this.filteredBosses = response;
    });
  }

  filterBosses() {
    this.filteredBosses = this.bosses.filter(boss =>
      boss.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}