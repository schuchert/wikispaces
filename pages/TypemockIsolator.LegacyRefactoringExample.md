---
title: TypemockIsolator.LegacyRefactoringExample
---
## Background
This work derives from an earlier presentation in Java from Berlin:
[[@http://vimeo.com/31927512]]

The general outline follows the one here: <http://schuchert.wikispaces.com/JMockIt.AStoryAboutTooMuchPower>

## Overview
Imagine you have a bit of legacy code you need to use to get your work done. For example, say you've been slated with finding currency conversion "deals". That is, given a number of currencies, there is a path that makes money due to asymmetries in conversions. Here's some C# code to get currency conversions:
{% highlight csharp %}
using System;
using System.Collections.Generic;
using System.Net;
using System.Text.RegularExpressions;

namespace LegacyRefactoringHtmlScreenScraping
{
    public class CurrencyConversion
    {
        private LinkedList<string> _allSymbolsCache;
        private DateTime _lastRead = DateTime.Now;

        public LinkedList<string> AllSymbols()
        {
            if (_allSymbolsCache != null 
                && DateTime.Now.Subtract(_lastRead).TotalMinutes < 5)
            {
                return _allSymbolsCache;
            }

            var client = new WebClient();
            string url = "http://www.jhall.demon.co.uk/currency/by_currency.html";
            var result = client.DownloadString(url);

            _lastRead = DateTime.Now;
            var foundTable = false;
            _allSymbolsCache = new LinkedList<string>();
            foreach (var s in result.Split('\r', '\n'))
            {
                if (foundTable)
                    if(Regex.IsMatch(s, "\\s+<td valign=top>[A-Z]{3}</td>"))
                        _allSymbolsCache.AddLast(
                            new Regex("</td>").Replace(
                                new Regex(".*top>").Replace(s, ""), ""));
                if (s.StartsWith("<h3>Currency Data"))
                    foundTable = true;
                else
                    continue;
            }
            return _allSymbolsCache;
        }

        public Decimal ConvertFromTo(string fromCurrency, string toCurrency)
        {
            if (!AllSymbols().Contains(fromCurrency))
                throw new CurrencyDoesNotExistException(fromCurrency);
            if (!AllSymbols().Contains(toCurrency))
                throw new CurrencyDoesNotExistException(toCurrency);

            string url = String
                .Format("http://www.gocurrency.com/v2/dorate.php?" +
                "inV=1&from={0}&to={1}&Calculate=Convert",
                        toCurrency, fromCurrency);
            var client = new WebClient();
            var result = client.DownloadString(url);

            var index = result.IndexOf("<div id=\"converter_results\"><ul><li>");
            var theGoodStuff = result.Substring(index);
            var startIndex = theGoodStuff.IndexOf("<b>") + 3;
            var endIndex = theGoodStuff.IndexOf("</b>");
            var importantStuff = theGoodStuff.Substring(startIndex, endIndex);
            var parts = importantStuff.Split('=');
            string almostValue = parts[1].Trim().Split(' ')[0];
            return System.Convert.ToDecimal(almostValue);
        }
    }
}
{% endhighlight %}
