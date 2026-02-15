import { Routes } from '@angular/router';
import { Register } from './features/pages/auth/register/register';
import { AuthLayout } from './core/layout/auth-layout/AuthLayout';
import { Login } from './features/pages/auth/login/login';
import { Jobs } from './features/pages/jobs/jobs';
import { JobDetails } from './features/pages/job-details/job-details';
import { UserDetails } from './features/pages/user-details/user-details';
import { authGuard } from './core/guards/role.guard';
import { MyFavoritesPage } from './features/pages/my-favorites-page/my-favorites-page';
import { MyCondidats } from './features/pages/my-condidats/my-condidats';

export const routes: Routes = [
     {
        path: '', 
        component: Jobs 
    },
    {
        path: 'jobs/:slug', 
        component: JobDetails,
        canActivate:[authGuard]
   },
   {
        path: 'profile',
        component: UserDetails,
        canActivate:[authGuard]
   },
   {
        path:'myfavorites',
        component: MyFavoritesPage,
        canActivate:[authGuard]
   },
   {
        path: 'mycondidats',
        component: MyCondidats,
        canActivate:[authGuard]
   },
    {
        path: 'auth',
        component: AuthLayout,
        children: [
            {
                path: 'register',
                component: Register
            },
            {
                path: 'login',
                component: Login
            }
        ]

    }
   
];
