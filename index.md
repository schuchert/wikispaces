---
layout: page
title: All the things
permalink: /index
---
## Recent Changes

{% capture thirty_days_ago %}
  {{'now' | date: '%s' | minus: 2592000 | date: "%Y-$m-$d" }}
{% endcapture %}
<ul>
{% for p in site.pages %}
  {% if p.date %}
    {% capture posted_on %}{{ p.date | date: "%Y-$m-$d" }}{% endcapture %}
    {% if posted_on > thirty_days_ago %}
      <li><a href="{{ site.url }}/{{ site.baseurl }}{{p.url}}">{{p.name}}</a></li>
    {% endif %}
  {% endif %}
{% endfor %}
</ul>

## All pages
Converted or otherwise.

<ul>
{% for p in site.pages %}
  <li><a href="{{ site.url }}/{{ site.baseurl }}{{p.url}}">{{p.name}}</a></li>
{% endfor %}
</ul>
