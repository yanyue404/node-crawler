const fs = require('fs');
function getBuildParams() {
  let p = process.argv[2] || '';
  let bp = {
    _bp: p,
  };
  p.split('@').forEach((item) => {
    let [k, v = ''] = item.split('=');
    k && (bp[k] = v);
  });
  if (bp.LOCAL) {
    // 设置开发时的默认参数
    bp.RUNTIME = 'local';
  } else {
    bp.RUNTIME = Date.now();
  }
  return bp;
}

export const BP = getBuildParams();

// 判断目录是否存在，不存在则创建
export const isExistDist = function (dir) {
  try {
    var stat = fs.statSync(dir);
    stat.isDirectory();
  } catch (err) {
    console.log('dir', dir);
    fs.mkdirSync(dir, { recursive: true });
  }
};

export const ERROR_LOG = (obj) => {
  console.log(JSON.stringify(obj, null, 4));
  fs.writeFile('error.log', JSON.stringify(obj, null, 4), () => {});
};
