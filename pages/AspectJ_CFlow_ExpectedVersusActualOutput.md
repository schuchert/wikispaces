[[AspectJ CFlow|<--Back]] [[AspectJ CFlowFormTheory|Next-->]]

## Expected Output==
Did you guess the output would look something like this? (Note this would be the output if we did not use the cflow pointcut.)
```
Saving: class cf.Address
Not saving: class cf.Address, it is unchanged
Saving: class cf.Address
Not saving: class cf.Address, it is unchanged
```
## Actual Output==
Or this?
```
Not saving: class cf.Address, it is unchanged
Not saving: class cf.Address, it is unchanged
Saving: class cf.Address
Not saving: class cf.Address, it is unchanged
```

[[AspectJ CFlow|<--Back]] [[AspectJ CFlowFormTheory|Next-->]]



