interface MenuItem {
  /** menu item code */
  code: string;
  /** menu labels */
  label: {
   
    en_US: string;
  };
  
  icon?: string;

  path: string;
  
  children?: MenuItem[];
  role?:string
}

export type MenuChild = Omit<MenuItem, 'children'>;

export type MenuList = MenuItem[];
