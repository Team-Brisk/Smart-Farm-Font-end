import type { FC } from 'react';

import { ReactComponent as AccountSvg } from '@/assets/menu/account.svg';
import { ReactComponent as DashboardSvg } from '@/assets/menu/dash.svg';
import { ReactComponent as DocumentationSvg } from '@/assets/menu/documentation.svg';
import { ReactComponent as GuideSvg } from '@/assets/menu/guide.svg';
import { ReactComponent as PermissionSvg } from '@/assets/menu/permission.svg';
import { ReactComponent as Device } from '@/assets/menu/devices.svg';
import { ReactComponent as Reports } from '@/assets/menu/reports.svg';
import { ReactComponent as Component } from '@/assets/menu/component.svg';

interface CustomIconProps {
  type: string;
}

export const CustomIcon: FC<CustomIconProps> = props => {
  const { type } = props;
  let com = <GuideSvg />;
 console.log(type)
  if (type === 'devices') {
    com = <Device />;
  } else if (type === 'Reports') {
    com = <Reports />;
  } else if (type === 'dashboard') {
    com = <DashboardSvg />;
  } else if (type === 'permission') {
    com = <Component />;
  } else if (type === 'documentation') {
    com = <DocumentationSvg />;
  } else {
    com = <GuideSvg />;
  }

  return <span className="anticon">{com}</span>;
};
