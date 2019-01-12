<div class="headnav-inner">
    <div class="headernav-core">
        <div class="logo-wrapper pointer"></div>
        <ul class="nav-list">
            {{each data.list as item index}}
            <li class="nav-item nav-item-{{index}} {{if item.active}}active{{/if}} pointer">
                <a href="{{item.href || 'javascript:'}}" data-index="{{index}}" data-sub="{{item.subNav ? 'true' : 'false'}}">{{item.text}}</a>
            </li>
            {{/each}}
        </ul>
        <span class="meun iconfont icon-menu pointer"></span>
    </div>
</div>
<div class="sub-display">
    <!-- template-inject -->
</div> 

