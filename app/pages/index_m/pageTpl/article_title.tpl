<ul class="title-list">
  {{each data as item index}}
  {{if index + 1 <= showNum}} 
  <li class="title-item">
    <span class="type">[{{_data[item.type].type}}]</span>
    <span class="text js-article pointer ellipsis" data-id="{{item.ID}}" data-type="{{item.type}}">{{item.text}}</span>
    <span class="date">[{{item.date}}]</span>
  </li>
  {{/if}}
  {{/each}}
</ul>