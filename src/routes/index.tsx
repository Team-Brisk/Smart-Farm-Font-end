import type { FC } from 'react';
import type { RouteObject } from 'react-router';

import { lazy } from 'react';
import { Navigate } from 'react-router';
import { useRoutes } from 'react-router-dom';

import Dashboard from '@/pages/dashboard';
import LayoutPage from '@/pages/layout';
import LoginPage from '@/pages/login';

import WrapperRouteComponent from './config';

const NotFound = lazy(() => import(/* webpackChunkName: "404'"*/ '@/pages/404'));
const RuleChain = lazy(() => import(/* webpackChunkName: "404'"*/ '@/pages/rulechain'));
const Devices = lazy(() => import(/* webpackChunkName: "guide'"*/ '@/pages/devices'));
const Reports = lazy(() => import(/* webpackChunkName: "guide'"*/ '@/pages/reports'));
const SmartDash1 = lazy(() => import(/* webpackChunkName: "guide'"*/ '@/pages/dashboard/SmartFarmDashboard'));
const RoutePermission = lazy(() => import(/* webpackChunkName: "route-permission"*/ '@/pages/permission/route'));
const FormPage = lazy(() => import(/* webpackChunkName: "form'"*/ '@/pages/components/form'));
const TablePage = lazy(() => import(/* webpackChunkName: "table'"*/ '@/pages/components/table'));
const SearchPage = lazy(() => import(/* webpackChunkName: "search'"*/ '@/pages/components/search'));
const TabsPage = lazy(() => import(/* webpackChunkName: "tabs'"*/ '@/pages/components/tabs'));
const DatePickerPage = lazy(() => import(/* webpackChunkName: "tabs'"*/ '@/pages/components/datePicker'));
const AsidePage = lazy(() => import(/* webpackChunkName: "aside'"*/ '@/pages/components/aside'));
const RadioCardsPage = lazy(() => import(/* webpackChunkName: "radio-cards'"*/ '@/pages/components/radio-cards'));
const BusinessBasicPage = lazy(() => import(/* webpackChunkName: "basic-page" */ '@/pages/business/basic'));
const BusinessWithSearchPage = lazy(() => import(/* webpackChunkName: "with-search" */ '@/pages/business/with-search'));
const BusinessWithAsidePage = lazy(() => import(/* webpackChunkName: "with-aside" */ '@/pages/business/with-aside'));
const BusinessWithRadioCardsPage = lazy(
  () => import(/* webpackChunkName: "with-aside" */ '@/pages/business/with-radio-cards'),
);
const BusinessWithTabsPage = lazy(() => import(/* webpackChunkName: "with-tabs" */ '@/pages/business/with-tabs'));

const routeList: RouteObject[] = [
  {
    path: '/login',
    element: <WrapperRouteComponent element={<LoginPage />} titleId="title.login" />,
  },
  {
    path: '/',
    element: <WrapperRouteComponent element={<LayoutPage />} titleId="" />,
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
        path: 'reports',
        element: <WrapperRouteComponent element={<Reports />} titleId="title.Devices" />,
      },
      {
        path: 'permission/route',
        element: <WrapperRouteComponent element={<RoutePermission />} titleId="title.permission.route" auth />,
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
        path: 'component/datePicker',
        element: <WrapperRouteComponent element={<DatePickerPage />} titleId="title.account" />,
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
        element: <WrapperRouteComponent element={<BusinessWithSearchPage />} titleId="title.account" />,
      },
      {
        path: 'business/with-aside',
        element: <WrapperRouteComponent element={<BusinessWithAsidePage />} titleId="title.account" />,
      },
      {
        path: 'business/with-radio-cards',
        element: <WrapperRouteComponent element={<BusinessWithRadioCardsPage />} titleId="title.account" />,
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
