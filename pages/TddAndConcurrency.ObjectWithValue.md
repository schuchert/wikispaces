---
title: TddAndConcurrency.ObjectWithValue
---
```java
package com.om.sharingwithoutguarding;

public class ObjectWithValue {
    private int value;

    public void incrementValue() {
        ++value;
    }

    public int getValue() {
        return value;
    }
}
```