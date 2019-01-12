import template from 'art-template/dist/template.js';
import $ from 'jquery/dist/jquery.min';
import Components from '../../components'; // 调用组件模块
import Api from '../../base/api/api.js';
import Swiper from '../../lib/swiper2/idangerous.swiper.min.js';
import './style.scss';

// ==== tpl ====
import artTpl from './pageTpl/article_title.tpl';

if (Api.Tool.browser().versions.mobile) location.replace('m/index.html')

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

  initEvent() {
    let self = this;

    $(window).on('resize', function() {
      let base = $(window).width() < 1280 ? 1280 : $(window).width();
      $('.wxzx-content, .js-Swiper_01').height(base / 1920 * 332);
      $('.yxts-content, .js-Swiper_02').height(base / 1920 * 750);
      Api.Tool.setQrcode($('.qrcode'))
    }).trigger('resize');

    $('.btn-swiper.btn-prev').click(() => self.data.swiper2.swipeNext())
    $('.btn-swiper.btn-next').click(() => self.data.swiper2.swipePrev())
    $('.gzwx-mask-wrapper .close').click(() => self.fn.wxMask('hide'))
    $('.open-weixin').click(() => self.fn.wxMask('show'))
    $('.to-news').click(() => location.href = 'news.html#__NEWS')
    $('.about-us').click(() => location.href = 'news.html#__NEWS?id=_6')
    $('.open-service').click(() => $('#KFLOGO .Lelem')[0].onclick())
    $('.bar-top').click(() => $('html, body').animate({ scrollTop: 0 }, 500))
    $('.to-yxts').click(() => $('html, body').animate({ scrollTop: $('.yxts-title').offset().top - 60 }, 500))
    $('.js-more_news').click(() => location.href = `news.html#__${self.data.route === 'LASTEST' ? 'NEWS' : self.data.route}`)

    // 侧边栏 slidebar
    $('.bar-item').click(function() {
      let index = $(this).index();
      if (index === 0) {
        $('html, body').animate({ scrollTop: $('.xwzx-title').offset().top - 200 }, 500)
      } else if (index === 1) {
        self.fn.wxMask('show')
      } else if (index === 2) {
        self.fn.downloadMask('show')
      } else if (index === 3) {
        $('#KFLOGO .Lelem')[0].onclick()
      }
    })

    // 新闻tab栏
    $('.js-newsType span').click(function() {
      let index = $(this).index();
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

  }

  // 该页面内部的渲染
  _renderPage() {
    let self = this;

    // 下载模块
    Components.Download.render({
      link: Api.STATIC.downloadLinks.byss
    });
    Components.Download.render({
      dom: '.js-Download_02',
      link: Api.STATIC.downloadLinks.byss,
      closeBtn: true,
      cb: () => self.fn.downloadMask('hide')
    });

    // 页脚
    Components.Footer.render();

    this.data.swiper1 = new Swiper('.js-Swiper_01', {
      loop: true,
      autoplay: 5000,
      pagination: `.swiper-pagination`,
      paginationClickable: true,
      autoplayDisableOnInteraction: false,
    });

    this.data.swiper2 = new Swiper('.js-Swiper_02', {
      loop: true,
      autoplay: 5000,
      paginationClickable: true,
      autoplayDisableOnInteraction: false,
    });

    this.fn.renderNews();
    Api.server53();
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
          for(var i = 0; i < data.length - 1; i++) {
            for(var j = i; j < data.length - 1; j++ ) {
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
          showNum: ($(window).width() > 1280 ? $(window).width() : 1280) / 260
        }))
      },
      wxMask(status) {
        if (status === 'show') {
          $('.gzwx-mask-wrapper').addClass('show')
          $('.bar_02').addClass('bar_act bar_act_02')
        } else {
          $('.gzwx-mask-wrapper').removeClass('show')
          $('.bar_02').removeClass('bar_act bar_act_02')
        }
      },
      downloadMask(status) {
        if (status === 'show') {
          $('.download-mask-wrapper').addClass('show')
          $('.bar_03').addClass('bar_act bar_act_03')
        } else {
          $('.download-mask-wrapper').removeClass('show')
          $('.bar_03').removeClass('bar_act bar_act_03')
        }
      }
    }
  }

  static start() {
    return Init.obj = new Init();
  }
}

Init.start();