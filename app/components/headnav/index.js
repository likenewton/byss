import template from 'art-template/dist/template.js';
import $ from 'jquery/dist/jquery.min';
import tpl from './headnav.tpl';
import Api from '../../base/api/api.js';
import './index.scss';

export default class Headnav {

  constructor(paraObj) {

    this.data = {
      componentName: 'Headnav',
      dom: '.js-Headnav',
      link: Api.STATIC.downloadLinks.byss[0],
      list: [],

    }

    this.setData(paraObj);
    this._render();
    this._addEvents();

  }

  setData(data, info) {
    let oldData = this[info || 'data'];
    let newData = $.extend(oldData, data);
    this[info || 'data'] = newData;
  }

  _render() {
    let data = this.data;

    this.$box = $(template.compile(tpl)({
      data
    }));
    if (this.$box) {
      this.$box.remove();
    }

    $(data.dom).html(this.$box);

  }

  _addEvents() {
    let self = this;
    let $doc = $(document);
    let $box = $(this.data.dom);

    $box.on('click', '.menu', (e) => {
      setTimeout(function() {
        let $meun = $(`${self.data.dom} .nav-list`);

        if ($meun.css('display') == 'none') {
          $meun.slideDown(300);
          $('.menu').addClass('show-menu')
        } else {
          $meun.slideUp(300);
          $('.menu').removeClass('show-menu')
        }
      }, 20)
    })

    $doc.on('click', `${self.data.dom} .logo-wrapper`, () => {
      location.href = './index.html';
    })

    $doc.on('click', `${self.data.dom} .nav-item`, (e) => {
      self.data.list[$(e.currentTarget).index()].cb()
    })

    $(document).click(() => {
      $('header .nav-list').slideUp(300)
      $('.menu').removeClass('show-menu')
    })

  }


};


Headnav.render = function(paraObj) {
  return Headnav.obj = new Headnav(paraObj);
}