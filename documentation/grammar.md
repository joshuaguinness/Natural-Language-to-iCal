#### Production rules for input string (preliminary)

```
S -> Summary DateTime ["." Description]
Summary -> [ Word ]+
DateTime -> (' on ' | ' by ') AbsoluteDateTime | [' on ' | ' by '] RelativeDateTime | (' from ' | ' between ') DateTimeRange
AbsoluteDateTime -> (( DayOfMonth MonthName [Year] ) | ( [Year] MonthName DayOfMonth ) | DayOfMonth '/' MonthNumber [ '/' Year ]) ['at' (AbsoluteTime | RelativeTime)]
RelativeDateTime -> RelativeDate [(' at ' | ' in the ') (AbsoluteTime | RelativeTime)]
DateTimeRange -> AbsoluteDateTime (' - ' | ' to ' | ' and ') AbsoluteDateTime
RelativeDate -> 'tomorrow' | 'today' | (('this' | 'next')  DayOfWeek)
DayOfWeek -> 'Mon' ['day'] | ... | 'Sun' ['day']
DayOfMonth -> 1 | ... | 31
MonthNumber -> 1 | ... | 12
MonthName -> 'Jan' [ 'uary' ] | ... | 'Dec' [ 'ember' ]
Year -> ( 2002 | ... | 2999 ) | ( 02 | ... | 99 )
AbsoluteTime -> MonthNumber ('am'| 'pm')
RelativeTime -> Morning | Noon | Afternoon | Evening | Night
Description -> [ Word ]*
Word -> [a-zA-Z0-9]+ | '!' | '?' | ' ' | '-' | '_' | ...
```

TODO: 
- Add RelativeDateTime to DateTimeRange