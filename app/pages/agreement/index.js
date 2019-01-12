import template from 'art-template/dist/template.js'
import $ from 'jquery/dist/jquery.min';
import Components from '../../components' // 调用组件模块
import Api from '../../base/api/api.js'
import tpl from './pageTpl/article.tpl'
import './style.scss'

if (Api.Tool.browser().versions.mobile) location.replace('m/agreement.html')

// ==== INIT ====
class Init {

  constructor() {
    this.data = {}
    this._renderPage()
  }

  // 该页面内部的渲染
  _renderPage() {
    Components.Footer.render({
      bgColor: '#f5f5f5',
      fontColor: '#bbb'
    })

    $('.article .content').html(template.compile(tpl)({
      companyName: Api.STATIC.isWanci ? '海南万磁' : '海南边缘'
    }))
  }

  static start() {
    return new Init()
  }

}

Init.start();