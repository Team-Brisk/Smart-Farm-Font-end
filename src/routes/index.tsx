import type { FC } from 'react';
import type { RouteObject } from 'react-router';

import { lazy } from 'react';
import { Navigate } from 'react-router';
import { useRoutes } from 'react-router-dom';

import Dashboard from '@/pages/dashboard';
import LayoutPage from '@/pages/layout';
import LoginPage from '@/pages/login';

import WrapperRouteComponent from './config';
import UserPage from '@/pages/Management';

const NotFound = lazy(() => import('@/pages/404'));
const RuleChain = lazy(() => import('@/pages/rulechain'));
const Devices = lazy(() => import('@/pages/devices'));
const Reports = lazy(() => import('@/pages/reports'));
const SmartDash1 = lazy(() => import('@/pages/dashboard/SmartFarmDashboard'));
const RoutePermission = lazy(() => import('@/pages/permission/route'));
const FormPage = lazy(() => import('@/pages/components/form'));
const TablePage = lazy(() => import('@/pages/components/table'));
const SearchPage = lazy(() => import('@/pages/components/search'));
const TabsPage = lazy(() => import('@/pages/components/tabs'));
const AsidePage = lazy(() => import('@/pages/components/aside'));
const RadioCardsPage = lazy(() => import('@/pages/components/radio-cards'));
const BusinessBasicPage = lazy(() => import('@/pages/business/basic'));
const BusinessWithSearchPage = lazy(() => import('@/pages/business/with-search'));
const BusinessWithAsidePage = lazy(() => import('@/pages/business/with-aside'));
const BusinessWithRadioCardsPage = lazy(() => import('@/pages/business/with-radio-cards'));
const BusinessWithTabsPage = lazy(() => import('@/pages/business/with-tabs'));

// -------------------------
// Route Guard
// -------------------------
const PrivateRoute = ({ element }: { element: JSX.Element }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return element;
};

// -------------------------
// Routes
// -------------------------
const routeList: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/login" replace />, // 👉 เข้าเว็บจะไป login ก่อน
  },
  {
    path: '/login',
    element: <WrapperRouteComponent element={<LoginPage />} titleId="title.login" />,
  },
  {
    path: '/', // ใช้ path อื่นเพื่อป้องกันชนกับ redirect
    element: (
      <PrivateRoute element={<WrapperRouteComponent element={<LayoutPage />} titleId="" />} />
    ),
    children: [
      {
        path: '',
        element: <Navigate to="dashboard" />,
      },
      {
        path: 'dashboard',
        element: <WrapperRouteComponent element={<Dashboard />} titleId="title.dashboard" />,
      },
      {
        path: 'dashboard/SmartFarmDashboard',
        element: <WrapperRouteComponent element={<SmartDash1 />} titleId="title.dashboard" />,
      },
      {
        path: 'rulechain',
        element: <WrapperRouteComponent element={<RuleChain />} titleId="title.RuleChain" />,
      },
      {
        path: 'devices',
        element: <WrapperRouteComponent element={<Devices />} titleId="title.Devices" />,
      },
      {
        path: 'reports',
        element: <WrapperRouteComponent element={<Reports />} titleId="title.Reports" />,
      },
      {
        path: 'users',
  element: <WrapperRouteComponent element={<UserPage />} titleId="title.Users" />,  
      },
      {
        path: 'permission/route',
        element: (
          <WrapperRouteComponent element={<RoutePermission />} titleId="title.permission.route" />
        ),
      },
      {
        path: 'component/form',
        element: <WrapperRouteComponent element={<FormPage />} titleId="title.account" />,
      },
      {
        path: 'component/table',
        element: <WrapperRouteComponent element={<TablePage />} titleId="title.account" />,
      },
      {
        path: 'component/search',
        element: <WrapperRouteComponent element={<SearchPage />} titleId="title.account" />,
      },
      {
        path: 'component/tabs',
        element: <WrapperRouteComponent element={<TabsPage />} titleId="title.account" />,
      },
      {
        path: 'component/aside',
        element: <WrapperRouteComponent element={<AsidePage />} titleId="title.account" />,
      },
      {
        path: 'component/radio-cards',
        element: <WrapperRouteComponent element={<RadioCardsPage />} titleId="title.account" />,
      },
      {
        path: 'business/basic',
        element: <WrapperRouteComponent element={<BusinessBasicPage />} titleId="title.account" />,
      },
      {
        path: 'business/with-search',
        element: (
          <WrapperRouteComponent
            element={<BusinessWithSearchPage />}
            titleId="title.account"
          />
        ),
      },
      {
        path: 'business/with-aside',
        element: (
          <WrapperRouteComponent element={<BusinessWithAsidePage />} titleId="title.account" />
        ),
      },
      {
        path: 'business/with-radio-cards',
        element: (
          <WrapperRouteComponent
            element={<BusinessWithRadioCardsPage />}
            titleId="title.account"
          />
        ),
      },
      {
        path: 'business/with-tabs',
        element: <WrapperRouteComponent element={<BusinessWithTabsPage />} titleId="title.account" />,
      },
      {
        path: '*',
        element: <WrapperRouteComponent element={<NotFound />} titleId="title.notFount" />,
      },
      
      
    ],
  },
];

const RenderRouter: FC = () => {
  const element = useRoutes(routeList);
  return element;
};

export default RenderRouter;
