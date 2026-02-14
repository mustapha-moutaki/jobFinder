import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { favoriteService } from '../../../core/services/favorite.service';
import { RouterLink } from '@angular/router';

interface FavoriteJob {
  id: number;
  userId: number;
  jobSlug: string;
  jobTitle: string;
  company: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  selector: 'app-my-favorites-page',
  templateUrl: './my-favorites-page.html',
  styleUrls: ['./my-favorites-page.css'],
})
export class MyFavoritesPage implements OnInit {
  private readonly favoriteService = inject(favoriteService);

  // Use a Signal: This forces the UI to update automatically
  favorites = signal<FavoriteJob[]>([]);

  ngOnInit() {
    const userString = localStorage.getItem('user');
    if (!userString) return;

    const user = JSON.parse(userString);
    const userId = user?.id || user?.userId;

    if (userId) {
      this.favoriteService.getFavoritesByUserId(userId).subscribe({
        next: (res: any) => {
          // If the API returns a direct array [{}, {}], we set it
          const data = Array.isArray(res) ? res : (res.data || []);
          this.favorites.set(data); 
          console.log('Favorites synced to UI:', this.favorites().length);
        },
        error: (err) => console.error('API Error:', err)
      });
    }
  }

  removeFavorite(id: number) {
    this.favoriteService.removeFavorite(id).subscribe({
      next: () => {
        // Update the UI immediately by removing the item from the signal
        this.favorites.update(items => items.filter(job => job.id !== id));
      },
      error: (err) => console.error("Failed to remove", err)
    });
  }
}