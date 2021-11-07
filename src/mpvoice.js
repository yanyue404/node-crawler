/*
 获取微信公众号的音频文件与歌谱 docs/mpvoice
*/
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

const ERROR_MESSAGE = {
  code: '0',
  message: '错误日志',
  list: [],
};

const baseDIR = '../docs/mpvoice';

// 微信公众号 get 请求获取音频的基础链接 + mpvoice 标签的voice_encode_fileid 属性
const baseAutioURL = 'https://res.wx.qq.com/voice/getvoice?mediaid=';

const getArticeListInfo = (arr = []) => {
  arr.forEach((href) => {
    _get(href).then((resp) => {
      const htmlDom = cheerio.load(resp);
      const title = htmlDom('head')
        .find('meta[property="og:title"]')
        .attr('content');
      console.log('得到文章标题：', title);
      const list = getAudioInfoList(htmlDom);
      console.log('得到音频列表：', list);
      // return;
      list.length > 0 && exportAudios(title, list);
    });
  });
};

const getAudioInfoList = ($) => {
  const result = [];
  $('body')
    .find('mpvoice')
    .each((index, mpvoiceTag) => {
      let obj = {
        name: $(mpvoiceTag).attr('name'),
        url: baseAutioURL + $(mpvoiceTag).attr('voice_encode_fileid'),
        // 寻找与音频文件对应的歌谱
        img: findSongSheet($(mpvoiceTag), index) || '',
      };
      result.push(obj);
    });
  return result;
};

// 获取音频文件上面的歌谱
const findSongSheet = ($mpvoice, index) => {
  try {
    let imgTag = null;
    let prevP = null; // 前一个 p 标签找
    let prevSection = null; // 前一个 section 标签找
    let prevTwoP = null; // 前两个 p 标签找
    console.log('find img ---------' + index);
    prevP = $mpvoice.parent().prev('p');
    prevTwoP = prevP && prevP.prev('p');
    prevSection = $mpvoice.parent().prev('section');

    if (prevP && !!prevP.find('img')) {
      imgTag = prevP.find('img');
      if (imgTag.attr('data-src')) {
        console.log('前一个 p 里有图片', imgTag.attr('data-src'));
        return imgTag.attr('data-src');
      } else {
        if (prevTwoP && !!prevTwoP.find('img')) {
          imgTag = prevTwoP.find('img');
          if (imgTag.attr('data-src')) {
            console.log('前两个 p 里有图片', imgTag.attr('data-src'));
            return imgTag.attr('data-src');
          } else {
            if (prevSection && !!prevSection.find('img')) {
              imgTag = prevSection.find('img');
              console.log('前一个 section 里有图片', imgTag.attr('data-src'));
              return imgTag.attr('data-src');
            }
          }
        }
      }
    }
    return imgTag.attr('data-src');
  } catch (error) {
    console.log(`error: 获取第 ${index}个图片失败`, error);
    return false;
  }
};

const exportAudios = (title, list = []) => {
  console.log('开始导出 ---');

  const dirRoot = path.join(__dirname, baseDIR, filenamify(title));
  isExistDist(dirRoot);

  list.forEach((v) => {
    let audioName = path.resolve(dirRoot, v.name);
    let imgName = '';
    const isAudios = /.(mp3|MP3|m4a|wma|weba|flac)/.test(audioName);
    if (!isAudios) {
      audioName += '.mp3';
    }

    if (v.img) {
      imgName =
        audioName.slice(0, audioName.lastIndexOf('.') + 1) +
        (v.img.match(/wx_fmt=(\w+)/)[1] || 'png');
      console.log('imgName', imgName);
    } else {
      ERROR_MESSAGE.list.push({
        title,
        name: audioName,
        img: '图片地址没有获取到，请查验是否正常',
      });
      ERROR_LOG(ERROR_MESSAGE);
    }

    // 导出 MP3
    if (audioName && v.url) {
      request
        .get(v.url)
        .on('response', function (response) {
          // console.log(response.statusCode); // 200
          console.log(
            `- 得到音频流: [${response.headers['content-type']}]  ${audioName}`,
          ); // 'image/png'
        })
        .on('error', function (err) {
          console.error(err);
        })
        .pipe(fs.createWriteStream(audioName));
    }
    if (imgName && v.img) {
      // 导出歌谱
      request
        .get(v.img)
        .on('response', function (response) {
          // console.log(response.statusCode); // 200
          console.log(
            `- 得到图片流: [${response.headers['content-type']}]  ${imgName}`,
          ); // 'image/png'
        })
        .on('error', function (err) {
          console.error(err);
        })
        .pipe(fs.createWriteStream(imgName));
    }
  });
};

getArticeListInfo(wx_list);
