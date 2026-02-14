import { Component, inject, OnInit, signal } from '@angular/core';
import { CondidatService } from '../../../core/services/condidat.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { 
  CdkDragDrop, 
  moveItemInArray, 
  transferArrayItem, 
  CdkDrag, 
  CdkDropList, 
  CdkDropListGroup 
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-my-condidats',
  standalone: true,
  imports: [CommonModule, RouterLink, CdkDropListGroup, CdkDropList, CdkDrag],
  templateUrl: './my-condidats.html',
  styleUrl: './my-condidats.css',
})
export class MyCondidats implements OnInit {
  private readonly condidatService = inject(CondidatService);

  isLoading = signal(true);
  
  // Three separate lists for the board
  pending = signal<any[]>([]);
  accepted = signal<any[]>([]);
  rejected = signal<any[]>([]);

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) return;

    this.condidatService.getCondidatsByUserId(user.id).subscribe({
      next: (res) => {
        // Sort items into their respective lists
        this.pending.set(res.filter(c => c.status === 'pending'));
        this.accepted.set(res.filter(c => c.status === 'accepted'));
        this.rejected.set(res.filter(c => c.status === 'rejected'));
        this.isLoading.set(false);
      }
    });
  }

  // Handle the drop event
  onDrop(event: CdkDragDrop<any[]>, newStatus: string) {
    if (event.previousContainer === event.container) {
      // Just reordering within the same column
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Moving from one column to another
      const item = event.previousContainer.data[event.previousIndex];
      
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // Update the status on the backend
      this.condidatService.updateCondidatStatus(item.id, newStatus).subscribe({
        next: () => console.log(`Status updated to ${newStatus}`),
        error: (err) => console.error('Failed to update status', err)
      });
    }
  }
}