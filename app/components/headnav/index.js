import template from 'art-template/dist/template.js';
import $ from 'jquery/dist/jquery.min';
import tpl from './headnav.tpl';
import './index.scss';

export default class Headnav {

    constructor(paraObj) {

        this.data = {
            componentName: 'Headnav',
            dom: '.js-Headnav',
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

        $box.on('click', '.meun', (e) => {
            let $meun = $(`${self.data.dom} .nav-list`);

            if ($meun.css('display') == 'none') {
                $meun.slideDown(300);
            } else {
                $meun.slideUp(300);
            }
        })

        $doc.on('click', `${self.data.dom} .logo-wrapper`, () => {
            location.href = 'index.html';
        })

    }

    static choiceTab(index, right) {
        if (right) {
            $('.js-Headnav .nav-item').removeClass('active');
            $('.js-Headnav .right').addClass('active');
        } else {
            $('.js-Headnav .right').removeClass('active');
            $('.js-Headnav .nav-item').removeClass('active');
            $('.js-Headnav .nav-item').eq(index - 1).addClass('active');
        }

    }

};


Headnav.render = function(paraObj) {
    return Headnav.obj = new Headnav(paraObj);
}