'use strict';

import template from 'art-template/dist/template.js';
import $ from 'jquery/dist/jquery.min';
import QRCode from '../../lib/qrcode/qrcode.js';
import '../style/base.scss';

template.config('escape', false);

let [NEWS, ACTIVITIES, WALKTHROUGH] = [{}, {}, {}]

const news = require.context('../../pages/news/pageTpl/NEWS', true, /\d+\.(tpl)$/)
const activities = require.context('../../pages/news/pageTpl/ACTIVITIES', true, /\d+\.(tpl)$/)
const walkthrough = require.context('../../pages/news/pageTpl/WALKTHROUGH', true, /\d+\.(tpl)$/)

// 将tpl文件打包进js中
news.keys().forEach((filename) => {
  let key = filename.replace('./', '_').replace('.tpl', '')
  NEWS[key] = news(filename)
})
activities.keys().forEach((filename) => {
  let key = filename.replace('./', '_').replace('.tpl', '')
  ACTIVITIES[key] = activities(filename)
})
walkthrough.keys().forEach((filename) => {
  let key = filename.replace('./', '_').replace('.tpl', '')
  WALKTHROUGH[key] = walkthrough(filename)
})


// 静态数据
const STATIC = {
  // 是否属于海南万磁的官网
  isWanci: location.origin.indexOf('3ag') > -1,
  isBianYuan: location.origin.indexOf('bys') > -1,
  _53CodeSrc: 'https://tb.53kf.com/code/code/10144804/1',
  // 游戏的下载地址['安卓', '苹果'],
  downloadLinks: {
    'byss': ['http://www.3agame.net/download/?iosid=1443705606&type=wc&gid=54&mid=10072', 'http://www.3agame.net/download/?iosid=1443705606&type=wc&gid=54&mid=10072'],
  },
  articleList: {
    NEWS,
    ACTIVITIES,
    WALKTHROUGH
  },
  titleList: {
    NEWS: [{
      ID: '_8',
      type: 'NEWS',
      text: '新春狂欢，鱼你有约',
      date: '2019-01-24'
    }, {
      ID: '_7',
      type: 'NEWS',
      text: '如何兑红包，我知道，你需要',
      date: '2019-01-23'
    }, {
      ID: '_5',
      type: 'NEWS',
      text: '新年新气象，捕鱼来更新啦！',
      date: '2019-01-07'
    }, {
      ID: '_4',
      type: 'NEWS',
      text: '拒绝山寨 认准官方正版',
      date: '2019-01-05'
    }, {
      ID: '_1',
      type: 'NEWS',
      text: '关于利用BUG刷道具相关公告',
      date: '2018-12-24'
    }, {
      ID: '_2',
      type: 'NEWS',
      text: '捕鱼圣手官方公告',
      date: '2018-12-24'
    }, {
      ID: '_3',
      type: 'NEWS',
      text: '12月12日游戏内容优化公告',
      date: '2018-12-12'
    }, {
      ID: '_6',
      type: 'NEWS',
      text: '关于我们',
      date: '2018-07-10'
    }],
    ACTIVITIES: [{
      ID: '_1',
      type: 'ACTIVITIES',
      text: '双蛋节捕鱼活动大狂欢，更有双倍话费等你来赢！',
      date: '2018-12-24'
    }],
    WALKTHROUGH: [{
      ID: '_1',
      type: 'WALKTHROUGH',
      text: '新手抓鱼小技巧',
      date: '2018-09-24'
    }, {
      ID: '_2',
      type: 'WALKTHROUGH',
      text: '中级船长的升级之路',
      date: '2018-09-18'
    }, {
      ID: '_3',
      type: 'WALKTHROUGH',
      text: '进阶版本-海底世界的霸主',
      date: '2018-09-03'
    }, {
      ID: '_4',
      type: 'WALKTHROUGH',
      text: '新手船长扬帆起航之道具介绍',
      date: '2018-08-08'
    }]
  }
}

// 工具包
const Tool = {

  browser: function() {
    return {
      versions: function() {
        var u = navigator.userAgent,
          app = navigator.appVersion;
        return {
          trident: u.indexOf('Trident') > -1, //IE内核
          presto: u.indexOf('Presto') > -1, //opera内核
          webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
          gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
          mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
          //ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
          android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
          iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
          iPad: u.indexOf('iPad') > -1, //是否iPad
          mac: u.indexOf('Mac') > -1, //是否mac
          webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
          weixin: u.indexOf('MicroMessenger') > -1, //是否微信
          qq: u.match(/\sQQ/i) == " QQ" || u.indexOf('mqqbrowser') > -1 //是否QQ浏览器 QQApp端亦可以用此判断
        };
      }(),
      language: (navigator.browserLanguage || navigator.language).toLowerCase()
    }
  },

  // 时间格式化
  formatdate(date, fmt) {
    date = new Date(date);
    let timeString = fmt || 'yyyy-mm-dd hh:ff:ss';
    let getFullYear = String(date.getFullYear());

    function padLeftZero(str) {
      var padLeft = '00';
      return (padLeft + str).substr(str.length);
    }

    // 如果存在至少一个y
    if (/(y+)/.test(timeString)) {
      // RegExp.$1 为匹配第一个大括号的内容
      timeString = timeString.replace(RegExp.$1, getFullYear.substr(4 - RegExp.$1.length));
    }
    let o = {
      'm+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'f+': date.getMinutes(),
      's+': date.getSeconds(),
    };
    for (var k in o) {
      if (new RegExp(`(${k})`).test(timeString)) {
        let str = String(o[k]);
        timeString = timeString.replace(RegExp.$1, str.length == 1 ? padLeftZero(str) : str);
      }
    }
    return timeString;
  },

  // 获取查询字符串
  getQuery(attr) {
    let href = location.href;
    let queryStr = href.substr(href.indexOf('?') + 1);
    let queryArr = queryStr.split('&');
    let queryObj = {};

    queryArr.forEach(v => {
      let tplArr = v.split('=');
      queryObj[tplArr[0]] = tplArr[1];
    })

    if (attr) return queryObj[attr];
    else return queryObj;
  },

  // 获取地址hash值
  getHash: function() {

    var herf = window.location.href;
    var hash = null;
    if (herf.indexOf('?') > -1) { //带参数
      hash = window.location.hash.split('?')[0];
    } else {
      hash = window.location.hash;
    }
    return hash;
  },

  // 设置二维码
  setQrcode($qrcode) {
    $qrcode.html('').each((i, e) => {
      let $e = $(e);
      new QRCode(e, {
        text: STATIC.downloadLinks.byss[0],
        width: Math.floor($e.width()),
        height: Math.floor($e.width()),
      });
      $e.append(`<img class="qrcode-icon" src='${require("../../static/img/qrcode_icon.png")}'>`);
    })
  }

}

const Route = {

  listenerRouteChange: function(cb) {
    //监听路由前进后退变化
    window.addEventListener("popstate", function(e) {
      cb && cb(e); //把路由放出来进行页面逻辑处理
    }, false);
  }

}

const server53 = function() {
  var _53code = document.createElement("script");
  _53code.src = STATIC._53CodeSrc;
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(_53code, s);

}

module.exports = {
  Tool,
  STATIC,
  Route,
  server53
}