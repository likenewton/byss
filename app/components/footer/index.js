import template from 'art-template/dist/template.js'
import Api from '../../base/api/api.js'
import $ from 'jquery/dist/jquery.min'
// === tpl ===
import tpl from './footer.tpl'
import tpl_wanci from './footer_wanci.tpl'
import tpl_02 from './footer_02.tpl'
import tpl_wanci_02 from './footer_wanci_02.tpl'
import './index.scss';


export default class Footer {

  constructor(paraObj) {
    this.data = {
      componentName: 'Footer',
      dom: '.js-Footer',
      type: 1,
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

    // 因为不同的站点需要显示不同的内容
    if (this.data.type === 1) {
      if (Api.STATIC.isWanci) {
        this.data.tpl = tpl_wanci
      } else if (Api.STATIC.isBianYuan) {
        this.data.tpl = tpl
      } else {
        this.data.tpl = tpl
      }
    } else if (this.data.type === 2) {
      if (Api.STATIC.isWanci) {
        this.data.tpl = tpl_wanci_02
      } else if (Api.STATIC.isBianYuan) {
        this.data.tpl = tpl_02
      } else {
        this.data.tpl = tpl_02
      }
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

    $('.type2 li').click(function() {
      let index = $(this).index()
      self.data.cbFnList[index] && self.data.cbFnList[index].cb()
    })

  }

};

Footer.render = function(paraObj) {
  return new Footer(paraObj);
}