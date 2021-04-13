const parser = require("./parser");

// TODO: Create tests for regex
// TODO: Create tests for end date before start date
// TODO: Test timeDecision

// setDateByDayOfWeek tests
test("setDateByDayOfWeek: set event to day of the week ", () => {
    const referenceDate = new Date("April 12, 2021 09:00:00"); // Monday
    const dayMatchArray = [
        ["tues", "tuesday"], 
        ["wed", "wednesday"],                    
        ["thurs", "thursday"], 
        ["fri", "friday"], 
        ["sat", "saturday"],                    
        ["sun", "sunday"],
        ["mon", "monday"] 
    ];
    for (let i = 0; i < dayMatchArray.length; i++) {
        let date = new Date("April 12, 2021 09:00:00");
        let event = parser.setDateByDayOfWeek(date, dayMatchArray[i], referenceDate);
        expect(event.getDate()).toBe(i+13);
    }
});

test("setDateByDayOfWeek: test error handling", () => {
    const referenceDate = new Date("April 12, 2021 09:00:00");
    const dayMatchArray = ["test", "test"];
    let date = new Date("April 12, 2021 09:00:00");
    let event = parser.setDateByDayOfWeek(date, dayMatchArray, referenceDate);
    const expected = "<span class=\"output-error\">Could not parse <i>test</i> as a relative date (Error D5)</span>";
    expect(event).toBe(expected);
})

// parseAbsoluteDateTime tests
test("parseAbsoluteDateTime: date slash format", () => {
    const inputYear = new Date().getFullYear() + 1;
    const input = "4/6/" + inputYear;
    const event = parser.parseAbsoluteDateTime(input);
    const expected = new Date(input);
    expect(event.toDateString()).toBe(expected.toDateString())
})

test("parseAbsoluteDateTime: date slash format without year", () => {
    const input = "4/6";
    let event = parser.parseAbsoluteDateTime(input);
    const currentDate = new Date();
    let expected = new Date();
    expected.setDate(6);
    expected.setMonth(3);
    if(currentDate > expected) {expected.setFullYear(expected.getFullYear() + 1);}
    expect(event.toDateString()).toBe(expected.toDateString())
})

test("parseAbsoluteDateTime: date written format without year", () => {
    const input = "Apr 11";
    let event = parser.parseAbsoluteDateTime(input);
    
    const currentDate = new Date();
    let expected = new Date();
    expected.setDate(11);
    expected.setMonth(3);
    if(currentDate > expected) {expected.setFullYear(expected.getFullYear() + 1);}

    expect(event.toDateString()).toBe(expected.toDateString())
})

test("parseAbsoluteDateTime: date written format", () => {
    const input = "Apr 12 2020";
    let event = parser.parseAbsoluteDateTime(input);
    expect(event.getMonth()).toBe(3);
    expect(event.getDate()).toBe(12);
    expect(event.getFullYear()).toBe(2020);
})

test("parseAbsoluteDateTime: relative date & time", () => {
    const input = "1055PM Thursday";
    let event = parser.parseAbsoluteDateTime(input);
    let expected = parser.setDateByDayOfWeek(new Date(), ["thurs", "thursday"], new Date())
    expected.setHours(10, 55, 0);
    expect(event.toDateString()).toBe(expected.toDateString())
    // expect(event.getTime()).toBe(expected.getTime());
})

test("parseAbsoluteDateTime: test error handling", () => {
    const input = "test";
    let event = parser.parseAbsoluteDateTime(input);
    const expected = "<span class=\"output-error\">Could not parse <i>test</i> as a date (Error D2)</span>";
    expect(event).toBe(expected);
})

// parseDateTimeRange tests
test("parseDateTimeRange: date range", () => {
    const input = "April 12 2021 to April 20 2021";
    const expectedBegin = new Date("April 12 2021");
    const expectedEnd = new Date("April 20 2021");
    parser.parseDateTimeRange(input);
    expect(parser.getEventBegin().toDateString()).toBe(expectedBegin.toDateString());
    expect(parser.getEventEnd().toDateString()).toBe(expectedEnd.toDateString());
})

test("parseDateTimeRange: date range without year", () => {
    const input = "March 12 to March 20";
    const currentDate = new Date();
    let expectedBegin = new Date("March 12");
    expectedBegin.setFullYear(currentDate.getFullYear())
    let expectedEnd = new Date("March 20");
    expectedEnd.setFullYear(currentDate.getFullYear())

    if(currentDate > expectedBegin) {expectedBegin.setFullYear(expectedBegin.getFullYear() + 1);}
    if(currentDate > expectedEnd) {expectedEnd.setFullYear(expectedEnd.getFullYear() + 1);}
    
    parser.parseDateTimeRange(input); 
    expect(parser.getEventBegin().toDateString()).toBe(expectedBegin.toDateString());
    expect(parser.getEventEnd().toDateString()).toBe(expectedEnd.toDateString());
})

test("parseDateTimeRange: end date before start date", () => {
    const input = "April 20 2021 to April 19 2021";
    const expected = "<span class=\"output-error\"><i>Monday, April 19, 2021</i> precedes start date (Error D3)</span>";
    parser.parseDateTimeRange(input);
    expect(parser.getEventEnd()).toBe(expected);
})

// parseRelativeDateTime tests
test("parseRelativeDateTime: relative date \"tomorrow\"", () => {
    const input = "tomorrow at 10 AM";
    let expected = new Date();
    expected.setDate(expected.getDate() + 1);
    expected.setHours(10, 0, 0);

    parser.parseRelativeDateTime(input);
    expect(parser.getEventBegin().toDateString()).toBe(expected.toDateString());
    expect(parser.getEventBegin().toTimeString()).toBe(expected.toTimeString());
})

test("parseRelativeDateTime: relative date \"today\"", () => {
    const input = "today at 10 AM";
    let expected = new Date();
    expected.setHours(10, 0, 0);

    parser.parseRelativeDateTime(input);
    expect(parser.getEventBegin().toDateString()).toBe(expected.toDateString());
    expect(parser.getEventBegin().toTimeString()).toBe(expected.toTimeString());
})

test("parseRelativeDateTime: relative date \"this\"", () => {
    const input = "this tuesday at 10 AM";
    const referenceDate = new Date();
    const dayMatch = ["tues", "tuesday"];
    const date = new Date();
    let expected = parser.setDateByDayOfWeek(date, dayMatch, referenceDate);
    expected.setHours(10, 0, 0);

    parser.parseRelativeDateTime(input);
    expect(parser.getEventBegin().toDateString()).toBe(expected.toDateString());
    expect(parser.getEventBegin().toTimeString()).toBe(expected.toTimeString());
})

test("parseRelativeDateTime: relative date \"next\"", () => {
    const input = "next tuesday at 10 AM";
    const referenceDate = new Date();
    const dayMatch = ["tues", "tuesday"];
    const date = new Date();
    let expected = parser.setDateByDayOfWeek(date, dayMatch, referenceDate);
    expected.setDate(expected.getDate() + 7);
    expected.setHours(10, 0, 0);

    parser.parseRelativeDateTime(input);
    expect(parser.getEventBegin().toDateString()).toBe(expected.toDateString());
    expect(parser.getEventBegin().toTimeString()).toBe(expected.toTimeString());
})

test("parseRelativeDateTime: relative time \"in the\"", () => {
    const input = "next tuesday in the morning";
    const referenceDate = new Date();
    const dayMatch = ["tues", "tuesday"];
    const date = new Date();
    let expected = parser.setDateByDayOfWeek(date, dayMatch, referenceDate);
    expected.setDate(expected.getDate() + 7);
    expected.setHours(9, 0, 0);

    parser.parseRelativeDateTime(input);
    expect(parser.getEventBegin().toDateString()).toBe(expected.toDateString());
    expect(parser.getEventBegin().toTimeString()).toBe(expected.toTimeString());
})

test("parseRelativeDateTime: error handling \"this\"", () => {
    const input = "this test at 10 AM";
    const expected = "<span class=\"output-error\">Could not parse <i>this test at 10 am</i> as a relative date (Error D4)</span>";
    parser.parseRelativeDateTime(input);
    expect(parser.getEventBegin()).toBe(expected);
})

test("parseRelativeDateTime: error handling \"next\"", () => {
    const input = "next test at 10 AM";
    const expected = "<span class=\"output-error\">Could not parse <i>next test at 10 am</i> as a relative date (Error D4)</span>";
    parser.parseRelativeDateTime(input);
    expect(parser.getEventBegin()).toBe(expected);
})

// splitSummaryDate tests
test("splitSummaryDate: summary-date separator \"on\" with absolute date", () => {
    const input = "Complete project on Wed Apr 14 2021 at 9:30 pm.";
    const expected = new Date("Apr 14 2021 9:30 pm");
    parser.splitSummaryDate(input);
    expect(parser.getEventBegin().toDateString()).toBe(expected.toDateString());
    expect(parser.getEventBegin().toTimeString()).toBe(expected.toTimeString());  
})

test("splitSummaryDate: summary-date separator \"on\" with relative date", () => {
    const input = "Complete project on next Wednesday at 9:30 pm.";
    const referenceDate = new Date();
    const dayMatch = ["wed", "wednesday"];
    const date = new Date();
    let expected = parser.setDateByDayOfWeek(date, dayMatch, referenceDate);
    expected.setDate(expected.getDate() + 7);
    expected.setHours(21, 30, 0);

    parser.splitSummaryDate(input);
    expect(parser.getEventBegin().toDateString()).toBe(expected.toDateString());
    expect(parser.getEventBegin().toTimeString()).toBe(expected.toTimeString());
})

test("splitSummaryDate: error handling summary-date separator \"on\"", () => {
    const input = "Complete project on test at 9:30 pm.";
    const expected = "<span class=\"output-error\">Could not compute due to invalid start date (Error T3)</span>";
    parser.splitSummaryDate(input);
    expect(parser.getEventEnd()).toBe(expected);
})

test("splitSummaryDate: summary-date separator \"by\" with absolute date", () => {
    const input = "Complete project by Wed Apr 14 2021 at 9:30 pm.";
    const expected = new Date("Apr 14 2021 9:30 pm");
    parser.splitSummaryDate(input);
    expect(parser.getEventBegin().toDateString()).toBe(expected.toDateString());
    expect(parser.getEventBegin().toTimeString()).toBe(expected.toTimeString());  
})

test("splitSummaryDate: summary-date separator \"by\" with relative date", () => {
    const input = "Complete project by next Wednesday at 9:30 pm.";
    const referenceDate = new Date();
    const dayMatch = ["wed", "wednesday"];
    const date = new Date();
    let expected = parser.setDateByDayOfWeek(date, dayMatch, referenceDate);
    expected.setDate(expected.getDate() + 7);
    expected.setHours(21, 30, 0);

    parser.splitSummaryDate(input);
    expect(parser.getEventBegin().toDateString()).toBe(expected.toDateString());
    expect(parser.getEventBegin().toTimeString()).toBe(expected.toTimeString());
})

test("splitSummaryDate: error handling summary-date separator \"by\"", () => {
    const input = "Complete project by test at 9:30 pm.";
    const expected = "<span class=\"output-error\">Could not compute due to invalid start date (Error T3)</span>";
    parser.splitSummaryDate(input);
    expect(parser.getEventEnd()).toBe(expected);
})

test("splitSummaryDate: range separator \"from\"", () => {
    const input = "Project presentation from 4/16/2021 at 10:30am to 4/16/2021 at 10:40am.";
    const expectedBegin = new Date("April 16, 2021 10:30 am");
    const expectedEnd = new Date("April 16, 2021 10:40 am");
    parser.splitSummaryDate(input);
    expect(parser.getEventBegin().toDateString()).toBe(expectedBegin.toDateString());
    expect(parser.getEventBegin().toTimeString()).toBe(expectedBegin.toTimeString());
    expect(parser.getEventEnd().toDateString()).toBe(expectedEnd.toDateString());
    expect(parser.getEventEnd().toTimeString()).toBe(expectedEnd.toTimeString());
})

test("splitSummaryDate: error handling range separator \"from\"", () => {
    const input = "Project presentation from test.";
    const expected = "<span class=\"output-error\">Could not find date range separator (Error S2)</span>";
    parser.splitSummaryDate(input);
    expect(parser.getEventEnd()).toBe(expected);
})

test("splitSummaryDate: range separator \"between\"", () => {
    const input = "Project presentation between 4/16/2021 at 10:30am to 4/16/2021 at 10:40am.";
    const expectedBegin = new Date("April 16, 2021 10:30 am");
    const expectedEnd = new Date("April 16, 2021 10:40 am");
    parser.splitSummaryDate(input);
    expect(parser.getEventBegin().toDateString()).toBe(expectedBegin.toDateString());
    expect(parser.getEventBegin().toTimeString()).toBe(expectedBegin.toTimeString());
    expect(parser.getEventEnd().toDateString()).toBe(expectedEnd.toDateString());
    expect(parser.getEventEnd().toTimeString()).toBe(expectedEnd.toTimeString());
})

test("splitSummaryDate: error handling range separator \"between\"", () => {
    const input = "Project presentation between test.";
    const expected = "<span class=\"output-error\">Could not find date range separator (Error S2)</span>";
    parser.splitSummaryDate(input);
    expect(parser.getEventEnd()).toBe(expected);
})

test("splitSummaryDate: no separator", () => {
    const input = "test";
    const expected = "<span class=\"output-error\">Could not find summary-date separator (Error S1)</span>";
    parser.splitSummaryDate(input);
    expect(parser.getEventSummary()).toBe(input);
    expect(parser.getEventBegin()).toBe(expected);
    expect(parser.getEventEnd()).toBe(expected);
})

test("splitSummaryDate: no event summary", () => {
    const input = " between 4/16/2021 at 10:30am to 4/16/2021 at 10:40am.";
    const expected = "Untitled Event";
    parser.splitSummaryDate(input);
    expect(parser.getEventSummary()).toBe(expected);
})

// splitAtPeriod tests
test("splitAtPeriod: with description", () => {
    const input = "Complete project by Apr 14 2001 at 9:30 pm. Submit everything on Gitlab.";
    const expected = "Submit everything on Gitlab.";
    parser.splitAtPeriod(input);
    expect(parser.getEventDescription()).toBe(expected);
})

test("splitAtPeriod: without description", () => {
    const input = "Complete project by Apr 14 2001 at 9:30 pm.";
    const expected = "No description";
    parser.splitAtPeriod(input);
    expect(parser.getEventDescription()).toBe(expected);
})

// timeDecision tests
test("timeDecision: error handling on non-string input", () => {
    const input = 0;
    const date = new Date();
    const expected = "<span class=\"output-error\">Could not parse <i>0</i> as date with time (Error T4)</span>";
    expect(parser.timeDecision(date, input)).toBe(expected);
})

test("timeDecision: invalid characters in time", () => {
    const date = new Date();
    const inputAM = "10:2qam";
    const expectedAM = "<span class=\"output-error\">Time <i>10:2qam</i> is invalid or contains unexpected characters (Error T6)</span>";
    const inputPM = "10:2qpm";
    const expectedPM = "<span class=\"output-error\">Time <i>10:2qpm</i> is invalid or contains unexpected characters (Error T6)</span>";
    expect(parser.timeDecision(date, inputAM)).toBe(expectedAM);
    expect(parser.timeDecision(date, inputPM)).toBe(expectedPM);
})