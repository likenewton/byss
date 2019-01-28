<ul class="title-list">
  {{each titleList[data.route] as item index}}
  {{if (data.curPage - 1) * data.pageSize <= index && index < data.curPage * data.pageSize}}
  <li class="title-item border-bottom-1px">
    <span class="text js-article ellipsis" data-id="{{item.ID}}" data-type="{{item.type}}">{{item.text}}</span>
    <span class="date">{{item.date}}</span>
  </li>
  {{/if}}
  {{/each}}
  {{if titleList[data.route].length === 0}}
  <div class="no-more">暂无文章可供展示</div>
  {{/if}}
</ul>