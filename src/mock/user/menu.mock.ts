import type { MenuList } from '@/interface/layout/menu.interface';

import { intercepter, mock } from '../config';
import { loginApi } from '@/api/auth';
const userStr = localStorage.getItem('user');
const userObj = userStr ? JSON.parse(userStr) : null;
const userRole = userObj?.role;
console.log(userRole)

const mockMenuList: MenuList = [
  {
    code: 'dashboard',
    label: {
     
      en_US: 'Dashboard',
    },
    icon: 'dashboard',
    path: '/dashboard',
  },
   
 
  
  
  {
    code: 'Reports',
    label: {
    
      en_US: 'Reports',
    },
    icon: 'Reports',
    path: '/reports',
     role: 'admin'
  },
   {
    code: 'Devices',
    label: {
    
      en_US: 'Devices',
    },
    icon: 'Devices',
    path: '/devices',
      role: 'admin'
  },
   {
    code: 'RuleChain',
    label: {
      
      en_US: 'RuleChain',
    },
    icon: 'guide',
    path: '/rulechain',
     role: 'admin'
  },
    {
    code: 'Users',
    label: {
      
      en_US: 'Users',
    },
    icon: 'Users',
    path: '/users',
     role: 'admin'
  },
   {
    code: 'component',
     role: 'admin',
    label: {
    
      en_US: 'Component',
    },
    icon: 'permission',
    path: '/component',
    
    children: [
      {
        code: 'componentForm',
        label: {
      
          en_US: 'Form',
        },
        path: '/component/form',
      },
      {
        code: 'componentTable',
        label: {
          
          en_US: 'Table',
        },
        path: '/component/table',
      },
      {
        code: 'componentSearch',
        label: {
        
          en_US: 'Search',
        },
        path: '/component/search',
      },
      {
        code: 'componentAside',
        label: {
        
          en_US: 'Aside',
        },
        path: '/component/aside',
      },
      {
        code: 'componentTabs',
        label: {
         
          en_US: 'Tabs',
        },
        path: '/component/tabs',
      },
      {
        code: 'componentTabs',
        label: {
         
          en_US: 'DatePicker',
        },
        path: '/component/datePicker',
      },
      {
        code: 'componentRadioCards',
        label: {
         
          en_US: 'Radio Cards',
        },
        path: '/component/radio-cards',
      },
    
    ],
  },
];

mock.mock('/user/menu', 'get', intercepter(mockMenuList));
