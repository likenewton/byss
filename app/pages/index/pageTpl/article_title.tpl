<ul class="title-list">
  {{each data as item index}}
  {{if index + 1 <= showNum}}
  {{if index === 0}}
  <li class="title-item first">
    <span class="yellow">NEW</span>
    <span class="text js-article pointer ellipsis" data-id="{{item.ID}}" data-type="{{item.type}}">
      <a class="ellipsis" href="news.html#__{{item.type}}?id={{item.ID}}">{{item.text}}</a>
    </span>
  </li>
  {{else}}
  <li class="title-item">
    <span>[{{_data[item.type].type}}]</span>
    <span class="text js-article pointer ellipsis" data-id="{{item.ID}}" data-type="{{item.type}}">
      <a class="ellipsis" href="news.html#__{{item.type}}?id={{item.ID}}">{{item.text}}</a>
    </span>
    <span class="date">{{item.date}}</span>
  </li>
  {{/if}}
  {{/if}}
  {{/each}}
</ul>