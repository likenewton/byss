import template from 'art-template/dist/template.js';
import $ from 'jquery/dist/jquery.min';
import Components from '../../components'; // 调用组件模块
import Api from '../../base/api/api.js';
import tpl from './pageTpl/article.tpl'
import './style.scss';

if (!Api.Tool.browser().versions.mobile) location.replace('agreement.html')

// ==== INIT ====
class Init {

  constructor() {
    this.data = {}
    this._renderPage();
  }

  initEvent() {
    let self = this;

    $('.js-back').click(() => {
      history.back()
    })

  }

  // 该页面内部的渲染
  _renderPage() {

    // 页头
    Components.Headnav.render({
      list: [{
        text: ['首页', 'HOME'],
        cb() {
          location.href = 'index_m.html'
        }
      }, {
        text: ['资讯中心', 'NEWS'],
        cb() {
          location.href = 'news_m.html#__NEWS'
        }
      }]
    });

    // 页脚
    Components.Footer_m.render({
      type: 1
    });

    $('.article .content').html(template.compile(tpl)({
      companyName: Api.STATIC.isWanci ? '海南万磁' : '海南边缘'
    }))

    this.initEvent()

  }

  static start() {
    return new Init();
  }
}

Init.start();