import { Routes } from '@angular/router';
import { Register } from './features/pages/auth/register/register';
import { AuthLayout } from './core/layout/auth-layout/AuthLayout';

export const routes: Routes = [
    {
        path: '',
        component: AuthLayout,
        children: [
            {
                path: 'register',
                component: Register
            }
        ]

    }
   
];
