#### Production rules for input string (preliminary)

```
S -> Summary DateTime ["." Description]
Summary -> [ Word ]+
DateTime -> (' on ' | ' by ') AbsoluteDateTime | [' on ' | ' by '] RelativeDateTime | (' from ' | ' between ') DateTimeRange
AbsoluteDateTime -> (( DayOfMonth MonthName [Year] ) | ( [Year] MonthName DayOfMonth ) | DayOfMonth '/' MonthNumber [ '/' Year ]) 'at' (AbsoluteTime | RelativeTime)
RelativeDateTime -> RelativeDate (' at ' | ' in the ') (AbsoluteTime | RelativeTime)
DateTimeRange -> AbsoluteDateTime (' - ' | ' to ' | ' and ') AbsoluteDateTime
RelativeDate -> 'tomorrow' | 'today' | (('this' | 'next')  DayOfWeek)
DayOfWeek -> 'Mon' ['day'] | ... | 'Sun' ['day']
DayOfMonth -> 1 | ... | 31
MonthNumber -> 1 | ... | 12
MonthName -> 'Jan' [ 'uary' ] | ... | 'Dec' [ 'ember' ]
Year -> ( 1900 | ... | 2999 ) | ( 00 | ... | 99 )
AbsoluteTime -> MonthNumber ('am'| 'pm')
RelativeTime -> Morning | Afternoon | Evening | Night
Description -> [ Word ]*
Word -> [a-zA-Z0-9]+ | '!' | '?' | ' ' | '-' | '_' | ...
```

TODO: 
- Word strings must not include reserved words like 'tomorrow'?
- Add RelativeDateTime to DateTimeRange