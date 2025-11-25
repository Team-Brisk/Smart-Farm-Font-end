import type { Notice } from '@/interface/layout/notice.interface';

import { intercepter, mock } from '../config';

const mockNoticeList: Notice<'all'>[] = [
 
];

mock.mock('/user/notice', 'get', intercepter(mockNoticeList));
