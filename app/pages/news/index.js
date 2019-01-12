import template from 'art-template/dist/template.js';
import $ from 'jquery/dist/jquery.min';
import Components from '../../components'; // 调用组件模块
import Api from '../../base/api/api.js';
import './style.scss';

// tpl
import crumbsTpl from './pageTpl/crumbs.tpl';
import titleTpl from './pageTpl/article_title.tpl';
import navTpl from './pageTpl/navigation.tpl';

if (Api.Tool.browser().versions.mobile) location.replace('m/news.html#__NEWS')

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

  initEvent() {
    let self = this;

    $(window).on('resize', function() {
      Api.Tool.setQrcode($('.qrcode'));
    }).trigger('resize')

    // router
    $('.to-home').click(() => location.href = 'index.html')
    $('.to-news').click(() => location.href = 'news.html#__NEWS')
    $('.to-activities').click(() => location.href = 'news.html#__ACTIVITIES')
    $('.to-walkthrough').click(() => location.href = 'news.html#__WALKTHROUGH')
    // download
    $('.android').click(() => window.open(Api.STATIC.downloadLinks.byss[0]))
    $('.ios').click(() => window.open(Api.STATIC.downloadLinks.byss[1]))
    // mask
    $('.weixin-wrapper').click(() => $('.gzwx-mask-wrapper').addClass('show'))
    $('.gzwx-mask-wrapper .close').click(() => $('.gzwx-mask-wrapper').removeClass('show'))

    // 打开新闻页
    $('.articles-wrapper').on('click', '.js-article', ((e) => {
      let $target = $(e.target)
      location.href = `news.html#__${$target.attr('data-type')}?id=${$target.attr('data-id')}`
    }))

    // navigation
    $('.navigation').on('click', '.left-btn', (e) => {
      if (self.data.curPage === 1) return
      location.href = `news.html#__${self.data.route}?page=${--self.data.curPage}`
    })
    $('.navigation').on('click', '.right-btn', (e) => {
      if (self.data.curPage === self.data.totalPage) return
      location.href = `news.html#__${self.data.route}?page=${++self.data.curPage}`
    })

  }

  // 该页面内部的渲染
  _renderPage() {

    Api.server53()

    this.fn.getRoute()
    this.fn.renderHeaderNav()
    this.fn.renderCrumbs()
    this.fn.renderArticleTitle()
    this.fn.renderArticleContent()
    this.fn.renderFuckSohard()
    this.fn.renderNavigation()

    Api.Route.listenerRouteChange((e) => {
      // 路由改变时的回调函数
      this.fn.getRoute()
      this.fn.renderHeaderNav()
      this.fn.renderCrumbs()
      this.fn.renderArticleTitle()
      this.fn.renderArticleContent()
      this.fn.renderFuckSohard()
      this.fn.renderNavigation()
    });

    // 游戏下载
    Components.Download.render({
      link: Api.STATIC.downloadLinks.byss,
      closeBtn: true,
      cb: () => $('.download-mask-wrapper').removeClass('show')
    });

    // 页脚
    Components.Footer.render({
      type: 2,
      cbFnList: [{
        cb: () => $('.download-mask-wrapper').addClass('show')
      }, {
        cb: () => $('.gzwx-mask-wrapper').addClass('show')
      }, {
        cb: () => $('#KFLOGO .Lelem')[0].onclick()
      }]
    });

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
        let id = Api.Tool.getQuery('id')
        $('.crumbs-nav').html(template.compile(crumbsTpl)({
          data: this._this.data,
          obj: Api.STATIC.titleList[this._this.data.route].filter((v) => v.ID == id)[0],
          id,
        }))
      },
      renderArticleTitle() {
        if (Api.Tool.getQuery('id')) return
        $('.articles-wrapper .module-core').html(template.compile(titleTpl)({
          data: this._this.data,
          titleList: Api.STATIC.titleList
        }))
      },
      renderArticleContent() {
        if (!Api.Tool.getQuery('id')) return
        let tpl = Api.STATIC.articleList[this._this.data.route][Api.Tool.getQuery('id')]
        $('.articles-wrapper .module-core').html(template.compile(tpl)({
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
        $('.articles-wrapper').css('minHeight', $(window).height() - $('.js-Footer').outerHeight() - 389)
      }
    }
  }

  static start() {
    return new Init();
  }
}

Init.start();