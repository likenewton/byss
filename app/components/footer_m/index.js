import template from 'art-template/dist/template.js'
import Api from '../../base/api/api.js'
import $ from 'jquery/dist/jquery.min'
import tpl from './footer.tpl'
import tpl_wanci from './footer_wanci.tpl'
import './index.scss';


export default class Footer_m {

  constructor(paraObj) {
    this.data = {
      componentName: 'Footer',
      dom: '.js-Footer-m',
      type: 2,
      tpl: '',
      cbFnList: [], // 回调函数列表
    }
    this.setData(paraObj);
    this._render(this.data);
  }

  setData(data, info) {
    let oldData = this[info || 'data'];
    let newData = $.extend(oldData, data);
    this[info || 'data'] = newData;
  }


  _render(data) {
    let self = this;

    if (Api.STATIC.isWanci) {
      this.data.tpl = tpl_wanci
    } else if (Api.STATIC.isBianYuan) {
      this.data.tpl = tpl
    } else {
      this.data.tpl = tpl
    }

    this.$box = $(template.compile(this.data.tpl)({ data }));
    if (this.$box) {
      this.$box.remove();
    }
    $(data.dom).append(this.$box);

    this._events();

  }

  _events() {
    let self = this;

    $(document).on('click', `${self.data.dom} .middle`, () => {
      $('body, html').animate({ scrollTop: 0 }, 500)
    })

  }

};

Footer_m.render = function(paraObj) {
  return new Footer_m(paraObj);
}