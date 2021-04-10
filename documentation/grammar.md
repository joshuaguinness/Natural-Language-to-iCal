#### Production rules for input string (preliminary)

```
S -> Summary DateTime ["." Description]
Summary -> [ Word ]+
DateTime -> AbsoluteDateTime | RelativeDateTime | DateTimeRange
AbsoluteDateTime ->
RelativeDateTime -> [' at ' | ' on ' | ' by '] RelativeDate ('at' | 'in the') (AbsoluteTime | RelativeTime)
DateTimeRange -> ['from' | 'between'] (AbsoluteDateTime | RelativeDateTime) (' - ' | ' to ' | ' and ') (AbsoluteDateTime | RelativeDateTime)
AbsoluteDate -> (( DayOfMonth MonthName [Year] ) | ( [Year] MonthName DayOfMonth ) | DayOfMonth '/' MonthNumber [ '/' Year ]) (AbsoluteTime | RelativeTime)
RelativeDate -> 'tomorrow' | 'today' | [('this' | 'next')  DayOfWeek]
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

(TODO: Word strings must not include reserved words like 'tomorrow'?)