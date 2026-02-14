import { Routes } from '@angular/router';
import { Register } from './features/pages/auth/register/register';
import { AuthLayout } from './core/layout/auth-layout/AuthLayout';
import { Login } from './features/pages/auth/login/login';
import { Jobs } from './features/pages/jobs/jobs';
import { JobDetails } from './features/pages/job-details/job-details';
import { UserDetails } from './features/pages/user-details/user-details';
import { authGuard } from './core/guards/role.guard';

export const routes: Routes = [
     {
        path: '', 
        component: Jobs 
    },
    {
        path: 'jobs/:slug', 
        component: JobDetails
   },
   {
        path: 'profile',
        component: UserDetails,
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
