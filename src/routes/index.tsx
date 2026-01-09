import type { FC } from 'react';
import type { RouteObject } from 'react-router-dom';

import { lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

import Dashboard from '@/pages/dashboard';
import LayoutPage from '@/pages/layout';
import LoginPage from '@/pages/login';
import UserPage from '@/pages/Management';

import WrapperRouteComponent from './config';

// lazy pages
const NotFound = lazy(() => import('@/pages/404'));
const RuleChain = lazy(() => import('@/pages/rulechain'));
const Devices = lazy(() => import('@/pages/devices'));
const Reports = lazy(() => import('@/pages/reports'));
const SmartDash1 = lazy(() => import('@/pages/dashboard/SmartFarmDashboard'));
const SmartDash2 = lazy(() => import('@/pages/dashboard/SmartFarmDashboard2'));
// const RoutePermission = lazy(() => import('@/pages/permission/route'));
const FormPage = lazy(() => import('@/pages/components/form'));
const TablePage = lazy(() => import('@/pages/components/table'));
const SearchPage = lazy(() => import('@/pages/components/search'));
const TabsPage = lazy(() => import('@/pages/components/tabs'));
const DatePickerPage = lazy(() => import('@/pages/components/datePicker'));
const AsidePage = lazy(() => import('@/pages/components/aside'));
const RadioCardsPage = lazy(() => import('@/pages/components/radio-cards'));


// -------------------------
// PrivateRoute (v6)
// -------------------------
const PrivateRoute: FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// -------------------------
// Routes
// -------------------------
const routeList: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: (
      <WrapperRouteComponent titleId="title.login">
        <LoginPage />
      </WrapperRouteComponent>
    ),
  },
  {
    path: '/',
    element: (
      <PrivateRoute>
        <WrapperRouteComponent auth>
          <LayoutPage />
        </WrapperRouteComponent>
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },

      {
        path: 'dashboard',
        element: (
          <WrapperRouteComponent titleId="title.dashboard">
            <Dashboard />
          </WrapperRouteComponent>
        ),
      },
      {
        path: 'dashboard/SmartFarmDashboard',
        element: (
          <WrapperRouteComponent titleId="title.dashboard">
            <SmartDash1 />
          </WrapperRouteComponent>
        ),
      },
      {
        path: 'dashboard/SmartFarmDashboard2',
        element: (
          <WrapperRouteComponent titleId="title.dashboard">
            <SmartDash2 />
          </WrapperRouteComponent>
        ),
      },
      {
        path: 'rulechain',
        element: (
          <WrapperRouteComponent titleId="title.RuleChain">
            <RuleChain />
          </WrapperRouteComponent>
        ),
      },
      {
        path: 'devices',
        element: (
          <WrapperRouteComponent titleId="title.Devices">
            <Devices />
          </WrapperRouteComponent>
        ),
      },
      {
        path: 'reports',
        element: (
          <WrapperRouteComponent titleId="title.Reports">
            <Reports />
          </WrapperRouteComponent>
        ),
      },
      {
        path: 'users',
        element: (
          <WrapperRouteComponent titleId="title.Users">
            <UserPage />
          </WrapperRouteComponent>
        ),
      },
      // {
      //   path: 'permission/route',
      //   element: (
      //     <WrapperRouteComponent titleId="title.permission.route">
      //       <RoutePermission />
      //     </WrapperRouteComponent>
      //   ),
      // },

      // components
      {
        path: 'component/form',
        element: (
          <WrapperRouteComponent titleId="title.account">
            <FormPage />
          </WrapperRouteComponent>
        ),
      },
      {
        path: 'component/table',
        element: (
          <WrapperRouteComponent titleId="title.account">
            <TablePage />
          </WrapperRouteComponent>
        ),
      },
      {
        path: 'component/search',
        element: (
          <WrapperRouteComponent titleId="title.account">
            <SearchPage />
          </WrapperRouteComponent>
        ),
      },
      {
        path: 'component/tabs',
        element: (
          <WrapperRouteComponent titleId="title.account">
            <TabsPage />
          </WrapperRouteComponent>
        ),
      },

      // business
     
      {
        path: '*',
        element: (
          <WrapperRouteComponent titleId="title.notFound">
            <NotFound />
          </WrapperRouteComponent>
        ),
      },
    ],
  },
];

// -------------------------
const RenderRouter: FC = () => {
  return useRoutes(routeList);
};

export default RenderRouter;
