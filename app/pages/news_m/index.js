import template from 'art-template/dist/template.js';
import $ from 'jquery/dist/jquery.min';
import Components from '../../components'; // 调用组件模块
import Api from '../../base/api/api.js';
import './style.scss';

// tpl
import crumbsTpl from './pageTpl/crumbs.tpl';
import titleTpl from './pageTpl/article_title.tpl';
import navTpl from './pageTpl/navigation.tpl';

if (!Api.Tool.browser().versions.mobile) location.replace(`news.html#__NEWS`)

// ==== INIT ====
class Init {

  constructor() {
    this.data = {
      route: 'NEWS', // 本页的路由
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
      },
      curPage: 1, // 当前页数 默认?page=1
      totalPage: 1, // 总页数，根据STATIC中计算
      pageSize: 6, // 一页展示的个数
    }
    this._fn();
    this._renderPage();
  }

  initEvent(CONFIG) {
    let self = this;

    $(window).on('resize', function() {
      Api.Tool.setQrcode($('.qrcode'));
    })

    // 打开新闻页
    $('.articles-wrapper-m').on('click', '.js-article', ((e) => {
      let $target = $(e.target)
      location.href = `./news_m.html#__${$target.attr('data-type')}?id=${$target.attr('data-id')}`
    }))

    // navigation
    $('.navigation').on('click', '.left-btn', (e) => {
      if (self.data.curPage === 1) return
      location.href = `./news_m.html#__${self.data.route}?page=${--self.data.curPage}`
    })
    $('.navigation').on('click', '.right-btn', (e) => {
      if (self.data.curPage === self.data.totalPage) return
      location.href = `./news_m.html#__${self.data.route}?page=${++self.data.curPage}`
    })

  }

  // 该页面内部的渲染
  _renderPage() {

    this.fn.scrollTop()
    this.fn.getRoute()
    this.fn.renderHeaderNav()
    this.fn.renderCrumbs()
    this.fn.renderArticleTitle()
    this.fn.renderArticleContent()
    this.fn.renderFuckSohard()
    this.fn.renderNavigation()

    Api.Route.listenerRouteChange((e) => {
      $('header .nav-list').hide()
      $('.menu').removeClass('show-menu')
      // 路由改变时的回调函数
      this.fn.scrollTop()
      this.fn.getRoute()
      this.fn.renderHeaderNav()
      this.fn.renderCrumbs()
      this.fn.renderArticleTitle()
      this.fn.renderArticleContent()
      this.fn.renderFuckSohard()
      this.fn.renderNavigation()
    });

    // 页头
    Components.Headnav.render({
      list: [{
        text: ['首页', 'HOME'],
        cb() {
          location.href = './index_m.html'
        }
      }, {
        text: ['新闻公告', 'NEWS'],
        cb() {
          location.href = './news_m.html#__NEWS'
        }
      }, {
        text: ['精彩活动', 'ACTIVITIES'],
        cb() {
          location.href = './news_m.html#__ACTIVITIES'
        }
      }, {
        text: ['游戏攻略', 'WALKTHROUGH'],
        cb() {
          location.href = './news_m.html#__WALKTHROUGH'
        }
      }, {
        text: ['微信公众号', 'WECHAT'],
        cb() {
          $('html, body').animate({ scrollTop: $('.weixin-qrcode').offset().top }, 500)
        }
      }]
    });

    // 页脚
    Components.Footer_m.render({
      type: 2,
      cbFnList: []
    });

    Api.Tool.setQrcode($('.qrcode'))
    Api.server53()
    this.initEvent()

  }

  _fn() {
    this.fn = {
      _this: this,
      getRoute() {
        let hash = Api.Tool.getHash();
        this._this.data.route = hash.split('__')[1]
        this._this.data.totalPage = Math.ceil(Api.STATIC.titleList[hash.split('__')[1]].length / this._this.data.pageSize)
        this._this.data.curPage = parseInt(Api.Tool.getQuery('page') || 1);
      },
      renderHeaderNav() {
        let $items = $('.nav-item div').removeClass('active');
        switch (this._this.data.route) {
          case 'NEWS':
            $items.eq(1).addClass('active')
            break
          case 'ACTIVITIES':
            $items.eq(2).addClass('active')
            break
          case 'WALKTHROUGH':
            $items.eq(3).addClass('active')
            break
        }
      },
      renderCrumbs() {
        $('.crumbs-nav').html(template.compile(crumbsTpl)({
          data: this._this.data,
        }))
      },
      renderArticleTitle() {
        if (Api.Tool.getQuery('id')) return
        $('.articles-wrapper-m .module-core_m').html(template.compile(titleTpl)({
          data: this._this.data,
          titleList: Api.STATIC.titleList
        }))
      },
      renderArticleContent() {
        if (!Api.Tool.getQuery('id')) return
        let tpl = Api.STATIC.articleList[this._this.data.route][Api.Tool.getQuery('id')]
        $('.articles-wrapper-m .module-core_m').html(template.compile(tpl)({
          isWanci: Api.STATIC.isWanci
        }))
      },
      renderFuckSohard() {
        let id = Api.Tool.getQuery('id')
        if (id) {
          // 如果id存在就代表目前是文章内容页面
          let obj = Api.STATIC.titleList[this._this.data.route].filter((v) => v.ID == id)[0];
          $('.tpl-article').prepend(`<h3 class="title">${obj.text}</h3><span class="date">${obj.date}</span>`)
        }
      },
      renderNavigation() {
        $('.navigation').html('')
        if (Api.Tool.getQuery('id')) return
        $('.navigation').html(template.compile(navTpl)({
          data: this._this.data
        }))
      },
      calcArticleHeight() {
        $('.articles-wrapper-m').css('minHeight', $(window).height() - $('.js-Footer').outerHeight() - 389)
      },
      scrollTop() {
        $('body, html').animate({ scrollTop: 0 }, 500)
      }
    }
  }

  static start() {
    return new Init();
  }
}

Init.start();