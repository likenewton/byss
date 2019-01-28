<div class="header-inner">
  <img class="logo" src="images/qrcode_icon.png">
  <h1>
    <p>捕鱼圣手</p>
    <span>满屏爆金根本停不下来!!</span>
  </h1>
  <a class="js-Download" href="{{data.link}}" target="_blank"></a>
  <span class="iconfont menu"></span>
  <ul class="nav-list">
    {{each data.list as item index}}
    <li class="nav-item">
      <div class="to-news">
        <p>{{item.text[0]}}</p>
        <span>{{item.text[1]}}</span>
      </div>
    </li>
    {{/each}}
  </ul>
</div>