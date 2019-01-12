import template from 'art-template/dist/template.js';
import $ from 'jquery/dist/jquery.min';
import tpl from './download.tpl';
import './index.scss';

export default class Download {

  constructor(paraObj) {
    this.data = {
      dom: '.js-Download',
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

    let $box = template.compile(tpl)({ data });

    $(data.dom).html($box);

    this._initEvent();

  }

  _initEvent() { 
    let self = this;

    $(`${this.data.dom} .btn-ios`).click(() => window.open(this.data.link[1]))

    $(`${this.data.dom} .btn-android`).click(() => window.open(this.data.link[0]))

    $(`${this.data.dom} .close`).click(() => this.data.cb && this.data.cb())

  }

  static render(paraObj) {
    return new Download(paraObj);
  }

};