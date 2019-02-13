---
layout: page
title: Java Launch page
---
## Java Stuff
{% for p in site.static_files %}
    {% if p.path contains '/pages/java' %}
        {% assign page_name = '/' | append: p.name %}
        {% assign dir_name = p.path | replace: page_name, '' %}
        {% assign dir_name = dir_name | replace: '/pages/java/', '' %}

        {% if current_path != dir_name %}
            {%- assign current_path = dir_name %}
### {{ current_path }}
        {% endif %}
<a href="{{ site.baseurl }}{{ p.path | replace: '.md','' }}">{{p.name}}</a><br/>
    {%- endif -%}
{% endfor %}

