import template from 'art-template/dist/template.js';
import $ from 'jquery/dist/jquery.min';
import Components from '../../components'; // 调用组件模块
import Api from '../../base/api/api.js';
import Swiper from '../../lib/swiper2/idangerous.swiper.min.js';
import './style.scss';

// ==== tpl ====
import artTpl from './pageTpl/article_title.tpl';

// 如果不是移动端就跳转PC页面
if (!Api.Tool.browser().versions.mobile) location.replace('index.html')

// ==== INIT ====
class Init {

  constructor() {
    this.data = {
      swiper1: null,
      swiper2: null, // 第二个轮播图的实例
      route: 'LASTEST', // 本页的路由(LASTEST表示最新的文章)
      NEWS: {
        crumbs: '新闻公告',
        type: '公告'
      },
      ACTIVITIES: {
        crumbs: '精彩活动',
        type: '活动'
      },
      WALKTHROUGH: {
        crumbs: '游戏攻略',
        type: '攻略'
      }
    }
    this._fn();
    this._renderPage();
  }

  initEvent(CONFIG) {
    let self = this;

    $(window).on('resize', function() {
      $('.wxzx-content .left').height($('.wxzx-content .left').width() * 0.68125);
      $('.yxts-content').height($('.yxts-content').width() * 0.8);
    }).trigger('resize');

    $('.js-more_news').click(() => {
      location.href = `./news_m.html#__${self.data.route === 'LASTEST' ? 'NEWS' : self.data.route}`
    })

    $('.js-newsType span').click(function() {
      let $target = $(this);
      let index = $target.index();

      if (index === 0) { // 最新
        self.data.route = 'LASTEST'
      } else if (index === 1) { // 新闻公告
        self.data.route = 'NEWS'
      } else if (index === 2) { // 精彩活动
        self.data.route = 'ACTIVITIES'
      } else if (index === 3) { // 攻略
        self.data.route = 'WALKTHROUGH'
      }
      $('.js-newsType span').removeClass('active').eq(index).addClass('active')
      self.fn.renderNews();
    })

    $(document).on('click', '.js-article', function() {
      location.href = `./news_m.html#__${$(this).attr('data-type')}?id=${$(this).attr('data-id')}`
    })

    $(document).on('click', '.js-Download', () => window.open(Api.STATIC.downloadLinks.byss[0]))

  }

  // 该页面内部的渲染
  _renderPage() {

    Api.server53();

    // 页头
    Components.Headnav.render({
      list: [{
        text: ['首页', 'HOME'],
        cb: () => $('html, body').animate({ scrollTop: 0 }, 500)
      }, {
        text: ['新闻资讯', 'NEWS'],
        cb: () => location.href = './news_m.html#__NEWS'
      }, {
        text: ['游戏特色', 'CHARACTERISTIC'],
        cb: () => $('html, body').animate({ scrollTop: $('.section_03 .title').offset().top - 100 }, 500)
      }, {
        text: ['微信公众号', 'WECHAT'],
        cb: () => $('html, body').animate({ scrollTop: $('.weixin-qrcode').offset().top }, 500)
      }, {
        text: ['关于我们', 'ABOUT'],
        cb: () => location.href = 'news_m.html#__NEWS?id=_6'
      }]
    });

    // 页脚
    Components.Footer_m.render();

    this.data.swiper1 = new Swiper('.js-Swiper_01', {
      loop: true,
      autoplay: 5000,
      pagination: `.js-Swiper_01 .swiper-pagination`,
      paginationClickable: true,
      autoplayDisableOnInteraction: false,
    });

    this.data.swiper2 = new Swiper('.js-Swiper_02', {
      loop: true,
      autoplay: 5000,
      paginationClickable: true,
      pagination: `.js-Swiper_02 .swiper-pagination`,
      autoplayDisableOnInteraction: false,
    });

    Api.Tool.setQrcode($('.qrcode'))
    this.fn.renderNews();
    this.initEvent()

  }

  _fn() {
    this.fn = {
      _this: this,
      renderNews() {
        let titleList = Api.STATIC.titleList;
        let route = this._this.data.route;
        let data = [];
        if (route === 'LASTEST') {
          ['NEWS', 'ACTIVITIES', 'WALKTHROUGH'].forEach((v) => {
            titleList[v].forEach((item) => {
              data.push(item)
            })
          })
          // 按照时间顺序排序
          for (var i = 0; i < data.length - 1; i++) {
            for (var j = i; j < data.length - 1; j++) {
              if (data[j].date < data[j + 1].date) {
                [data[j], data[j + 1]] = [data[j + 1], data[j]]
              }
            }
          }
        } else {
          data = titleList[route]
        }
        // 新闻
        $('.news_title_content').html(template.compile(artTpl)({
          _data: this._this.data,
          data,
          showNum: 4
        }))
      },
      scrollTop() {
        $('body, html').animate({ scrollTop: 0 }, 0)
      }
    }
  }

  static start() {
    return Init.obj = new Init();
  }
}

Init.start();