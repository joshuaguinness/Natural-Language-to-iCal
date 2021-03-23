#### Production rules for input string (preliminary)

```
S -> Summary Date ["." Description]
Summary -> [ Word ]+
Date -> [' at ' | ' on '] ( AbsoluteDate | RelativeDate )
AbsoluteDate -> ( DayOfMonth MonthName [Year] ) | ( [Year] MonthName DayOfMonth ) | DayOfMonth '/' MonthNumber [ '/' Year ]
RelativeDate -> 'tomorrow' | 'today' | [ 'this' | 'next' ] DayOfWeek
DayOfWeek -> 'Mon' ['day'] | ... | 'Sun' ['day']
DayOfMonth -> 1 | ... | 31
MonthNumber -> 1 | ... | 12
MonthName -> 'Jan' [ 'uary' ] | ... | 'Dec' [ 'ember' ]
Year -> ( 1900 | ... | 2999 ) | ( 00 | ... | 99 )
Description -> [ Word ]*
Word -> [a-zA-Z0-9]+ | '!' | '?' | ' ' | '-' | '_' | ...
```

(TODO: Time, date ranges?, Word strings must not include reserved words like 'tomorrow'?)