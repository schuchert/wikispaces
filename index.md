# Description
A top level list of all the pages on this site.

<ul>
{% for p in site.static_files %}
  <li><a href="{{ site.pagesurl }}/{{ p.basename }}">{{p.name}}</a></li>
{% endfor %}
</ul>
