# Overview
This is my plan for my talk at the Austin Java User's Group on February 28 2012. As with any plan I have, it's a placeholder but what actually happens depends on the conditions on the ground, so take it with a grain of salt.

# Outline
## Part 0
### What
* Working with legacy code
* Dynamic Link Seams with modern mocking tools
* How can tools help/hinder feedback (and what kind of feedback do we mean by that question)
### How
* Code review with a list of things to consider fixing
* Writing dynamic link seams to write automated unit checks
* Discuss traditional legacy refactoring techniques
* Apply legacy refactoring techniques
* Compare and contrast tests written with modern mocking tools and using traditional legacy refactoring techniques
* Update dynamic link seam test to take legacy refactoring into consideration
* Compare and contrast original and updated dynamic link seam-based unit check
* Discuss the implications with respect to the amount of discipline required to not make a mess as it relates to different kinds of mocking tools
## Part 1
* Review some code ([[@https://github.com/schuchert/welc_examples_java_jmockit|original available on github]] )
```java
package com.schuchert.welc;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;

public class CurrencyConversion {
   static Map<String, String> allCurrenciesCache;
   static long lastCacheRead = Long.MAX_VALUE;

   public static Map<String, BigDecimal> allConversions() {
      Map<String, String> allSymbols = CurrencyConversion.currencySymbols();
      Map<String, BigDecimal> conversions 
          = new ConcurrentHashMap<String, BigDecimal>();
      for (String outerSymbol : allSymbols.keySet())
         for (String innerSymbol : allSymbols.keySet()) {
            BigDecimal conversion = null;
            try {
               conversion = CurrencyConversion.convertFromTo(outerSymbol,
                     innerSymbol);
            } catch (RuntimeException e) {
               conversion = BigDecimal.ZERO;
            }
            conversions.put(String.format("%s-%s", outerSymbol, innerSymbol),
                  conversion);
         }
      return conversions;
   }

   public static Map<String, String> currencySymbols() {
      if (allCurrenciesCache != null
            && System.currentTimeMillis() - lastCacheRead < 5 * 60 * 1000) {
         return allCurrenciesCache;
      }

      Map<String, String> symbolToName = new ConcurrentHashMap<String, String>();
      String url = "http://www.xe.com/iso4217.php";
      try {
         HttpClient httpclient = new DefaultHttpClient();
         HttpGet httpget = new HttpGet(url);
         HttpResponse response = httpclient.execute(httpget);
         HttpEntity entity = response.getEntity();
         if (entity != null) {
            InputStream instream = entity.getContent();
            InputStreamReader irs = new InputStreamReader(instream);
            BufferedReader br = new BufferedReader(irs);
            String l;
            boolean foundTable = false;
            while ((l = br.readLine()) != null) {
               if (foundTable) {
                  Pattern symbol = Pattern.compile("href=\"/currency/"
                        + "[^>]+>(...)</a></td><td class=\"[^\"]+\">"
                        + "([A-Za-z ]+)");
                  Matcher m = symbol.matcher(l);
                  while (m.find()) {
                     symbolToName.put(m.group(1), m.group(2));
                  }
               }
               if (l.indexOf("currencyTable") >= 0)
                  foundTable = true;
               else
                  continue;
            }
         }

      } catch (Exception e) {
         throw new RuntimeException(e);
      }

      allCurrenciesCache = symbolToName;
      lastCacheRead = System.currentTimeMillis();

      return symbolToName;
   }

   public static BigDecimal convertFromTo(String fromCurrency,
         String toCurrency) {
      Map<String, String> symbolToName = currencySymbols();
      if (!symbolToName.containsKey(fromCurrency))
         throw new IllegalArgumentException(String.format(
               "Invalid from currency: %s", fromCurrency));
      if (!symbolToName.containsKey(toCurrency))
         throw new IllegalArgumentException(String.format(
               "Invalid to currency: %s", toCurrency));
      String url = String
            .format("http://www.gocurrency.com/v2/dorate.php?inV=1&from=%s&to" +
            		"=%s&Calculate=Convert",
                  toCurrency, fromCurrency);
      try {
         HttpClient httpclient = new DefaultHttpClient();
         HttpGet httpget = new HttpGet(url);
         HttpResponse response = httpclient.execute(httpget);
         HttpEntity entity = response.getEntity();
         StringBuffer result = new StringBuffer();
         if (entity != null) {
            InputStream instream = entity.getContent();
            InputStreamReader irs = new InputStreamReader(instream);
            BufferedReader br = new BufferedReader(irs);
            String l;
            while ((l = br.readLine()) != null) {
               result.append(l);
            }
         }
         String theWholeThing = result.toString();
         int start = theWholeThing
               .lastIndexOf("<div id=\"converter_results\"><ul><li>");
         String substring = result.substring(start);
         int startOfInterestingStuff = substring.indexOf("<b>") + 3;
         int endOfIntererestingStuff = substring.indexOf("</b>",
               startOfInterestingStuff);
         String interestingStuff = substring.substring(
               startOfInterestingStuff, endOfIntererestingStuff);
         String[] parts = interestingStuff.split("=");
         String value = parts[1].trim().split(" ")[0];
         BigDecimal bottom = new BigDecimal(value);
         return bottom;
      } catch (Exception e) {
         throw new RuntimeException(e);
      }
   }
}
```
* Review this code, what is worth changing?
** Static methods
** Embedded news
** Long methods
** Use of regular expressions
** Embedded use of web client - extract class or at least make separate method
** Violation of DIP
** Violation of SRP
** Violation of Law of Demeter
** ... There are lots of opportunities
* What should we fix?
** Pull model
** Nothing without a change case
** General discussion
* Change case:
>> We want to develop an algorithm that will analyze currency conversion to see if we can find any deals due to asymmetries in the various conversion rates up to a certain length. This is essentially a graph traversal algorithm that finds loops of a certain length which have different costs to traverse. We need to grow this algorithm and possibly introduce some heuristics after we get the basic algorithm working. Problem is, it will be hard to get this right and we need to test it because it will be a multi-million dollar investment scheme.
## Part 2
Enter JMockIt. Here's a test to just exercise the code: