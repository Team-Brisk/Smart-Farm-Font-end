import type { FC, ReactNode } from 'react';
import { useEffect } from 'react';
import { useIntl } from 'react-intl';

import PrivateRoute from './pravateRoute';

export interface WrapperRouteProps {
  /** document title locale id */
  titleId?: string;
  /** authorization */
  auth?: boolean;
  children: ReactNode;
}

const WrapperRouteComponent: FC<WrapperRouteProps> = ({
  titleId,
  auth,
  children,
}) => {
  const { formatMessage } = useIntl();

  useEffect(() => {
    if (titleId) {
      document.title = formatMessage({ id: titleId });
    }
  }, [titleId, formatMessage]);

  if (auth) {
    return <PrivateRoute>{children}</PrivateRoute>;
  }

  return <>{children}</>;
};

export default WrapperRouteComponent;
