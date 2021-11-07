import cheerio from 'cheerio';
const filenamify = require('filenamify');
const request = require('request');
const fs = require('fs');
const path = require('path');
import { _get } from './common/http';
import { isExistDist, ERROR_LOG } from './utils';
console.log('Start ----- OK');

let wx_list = [
  // 11.7 临时链接
  'https://mp.weixin.qq.com/s?__biz=MzU1MTQwNDE2NA==&tempkey=MTEzOF9LWDN1aHk1UllsRFpHWmRrLXZ0MmlsWi1icFBqalg0VnAzVjczRk1SZmh5Sk9BLXFPTy14NEFTNVdKTDV5S3VjVHVpdTJieklyVWkxSHB6SGZrdHFEQjAwam52b2dYcFdwV2o1NjE4NnZjaXllUEZpMThEb3dpaUVUOFBlT29HNWVoME5VUEJDR1pVWUgxVm1hS2xKbjlQTDJYaHhaYkl5SEFsVE13fn4%3D&chksm=7b9088984ce7018ee0eeff132885c97194531dc125eccd203c53bef40dec335859a7ed37ea4e&mpshare=1&scene=1&srcid=1107NJHsBzUZUZ69ijn3u4HG&sharer_sharetime=1636240803588&sharer_shareid=955116def89859778e01037d0caba41f#wechat_redirect', // 临时链接
  // 'https://mp.weixin.qq.com/s/vRl9_rSt_vxLlLhdgqVsvQ', // 6.6
  'https://mp.weixin.qq.com/s/sLJJeFF54xGYAz_VdsAv4A', // 5.30 错误
  /*   'https://mp.weixin.qq.com/s/xiXwkwgCnlx9kHeu57l77A', // 5.16
  'https://mp.weixin.qq.com/s/Qclibizald6KFsA_Nuwn1g', // 5.9
  'https://mp.weixin.qq.com/s/k03K6x1NxfrQMtprJsg43g', // 5.2
  'https://mp.weixin.qq.com/s/3O49MUpjBiivKqK64dMQKQ', // 4.25 */
  'https://mp.weixin.qq.com/s/j2ATVeuvTWka3GSJbDXEPQ', // 4.18 错误
  /*   'https://mp.weixin.qq.com/s/Vm-dQk4jQVDZGjZCTZ75Qg', // 4.11
  'https://mp.weixin.qq.com/s/0R-KDVprFeTUy0mzH0NGkQ', // 4.4
  'https://mp.weixin.qq.com/s/mc_hbdBqrxSZvVj669DWEA', // 3.28
  'https://mp.weixin.qq.com/s/vnBg4KUn9Nkw-b9mqhfKmw', // 3.21
  'https://mp.weixin.qq.com/s/v2kR37Q4qRt1hJLip0D_VQ', // 3.14
  'https://mp.weixin.qq.com/s/i2L6SLPUQtE_FWl75vAF4A', // 3.7 */
  'https://mp.weixin.qq.com/s/hwpSfDlpvv-VjKVR6RScfg', // 2.28 错误
  /*   'https://mp.weixin.qq.com/s/J5r-Ml0bYyYjRUDpOGAP1A', // 2.21
  'https://mp.weixin.qq.com/s/syZ54wPyHqhzwfSIAvtoCQ', // 2.14
  'https://mp.weixin.qq.com/s/xUP-nkcRcBL8DVo4qxQwjA', // 2.7
  'https://mp.weixin.qq.com/s/-dZ7NEJ0P4fIcmXoRFjxug', // 1.31
  'https://mp.weixin.qq.com/s/U4BLP-ieeRQZbYM8TKMjHg', // 1.24
  'https://mp.weixin.qq.com/s/wFDq43ENsWinL2xsmNyglg', // 1.17
  'https://mp.weixin.qq.com/s/qY7RMVCd8cfyS0hbYa7hNQ', // 1.3
  'https://mp.weixin.qq.com/s/8djNzOY30-mcjYjkHgH3nw', // 12.27
  'https://mp.weixin.qq.com/s/hgEadRBAKf2wGiOGQBC9iA', // 12.20
  'https://mp.weixin.qq.com/s/Ptle4fOCRYQw3epIHsopoA', // 12.13 */
  'https://mp.weixin.qq.com/s/y___zQIDOAamnZwXQ0DEyQ', // 12.6 错误
  /*   'https://mp.weixin.qq.com/s/3eqq9_UZ-glnuHlaMuCDfg', // 11.29
  'https://mp.weixin.qq.com/s/GmlvdUNXFtaBXaRMWBDHZA', // 11.22
  'https://mp.weixin.qq.com/s/YaSeZTrtPTL1u-r0uoSo2A', // 11.15 */
  'https://mp.weixin.qq.com/s/XAygXdvMFCdZkTbBZoXvEg', // 11.8 错误
  /*   'https://mp.weixin.qq.com/s/FXpvfQM0ib-QXDXEfeiacg', // 11.1
  'https://mp.weixin.qq.com/s/5UOTB24qQOOIpSvzSXl-CA', // 10.25
  'https://mp.weixin.qq.com/s/QHMB63hEhAtOYl9mYheVgQ', // 10.18 */
  'https://mp.weixin.qq.com/s/CbkUsKsaxYOKATnBPPqOiA', // 10.4  错误
  /*  'https://mp.weixin.qq.com/s/GQpw6PuqTMDqt5ohK3WevQ', // 9.27
  'https://mp.weixin.qq.com/s/VKrGjE4yI19jqb7Mk_YSgg', // 9.20
  'https://mp.weixin.qq.com/s/8WTDlyrR1LN1a227QA1hcg', // 9.13
  'https://mp.weixin.qq.com/s/EloxohCY6a07U3WyG22FlA', // 9.6
  'https://mp.weixin.qq.com/s/tDE4BmmyYFUPHzC25zlkfA', // 8.30
  'https://mp.weixin.qq.com/s/z1V3TMT9A9UvDq9wrk5tJw', // 8.23
  'https://mp.weixin.qq.com/s/OgE0l-WqzmzTSqrUX5V1Og', // 8.16
  'https://mp.weixin.qq.com/s/qfHLjK9U7t7PfTQy1u4ZCw', // 8.9 */
  /*   'https://mp.weixin.qq.com/s/2LHZJTrFzTgy63Xwk6aFKA', // 7.26
  'https://mp.weixin.qq.com/s/xmW1V4Vy1H-KiYBxk6kPhg', // 7.19 // 上面第一个 p 里是图片
  'https://mp.weixin.qq.com/s/s3ujgcULzn6NPLr5ijl0rQ', // 7.12
  'https://mp.weixin.qq.com/s/EaREPXE4Wo7CX0-YI1Fdcg', // 7.5 上面相邻的 section 里是图片
  'https://mp.weixin.qq.com/s/hWUz5FWgKL27mu-d_tR-bg', // 6.28 上面第两个 p 是图片
  'https://mp.weixin.qq.com/s/W_qrrQA109ONIIjBTaE5Cw', // 6.21
  'https://mp.weixin.qq.com/s/qCC8JktbBnTE0aY0tYr_BA', // 6.14
  'https://mp.weixin.qq.com/s/88lNIaWXMjjcT5EMAVoLQw', // 6.7 */
];
