import { Routes } from '@angular/router';
import { Register } from './features/pages/auth/register/register';
import { AuthLayout } from './core/layout/auth-layout/AuthLayout';
import { Login } from './features/pages/auth/login/login';
import { Jobs } from './features/pages/jobs/jobs';

export const routes: Routes = [
     {
        path: '', 
        component: Jobs 
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
