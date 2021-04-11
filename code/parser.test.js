const parser = require("./parser");

// TODO: Create tests for regex
// TODO: Create tests for end date before start date
// TODO: Test parseDateTimeRange
// TODO: Test parseRelativeDateTime
// TODO: Test parseDateTime
// TODO: Test splitSummaryDate
// TODO: Test splitAtPeriod

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
    const expected = "<span class=\"output-error\">Could not parse <i>test</i> as a relative date (Error D3)</span>";
    expect(event).toBe(expected);
})

// parseAbsoluteDateTime tests
test("parseAbsoluteDateTime: date slash format", () => {
    const input = "4/6/2021";
    let event = parser.parseAbsoluteDateTime(input);
    const expected = "Tue Apr 06 2021"
    expect(event.toDateString()).toBe(expected)
})

test("parseAbsoluteDateTime: date slash format without year", () => {
    const input = "4/6";
    let event = parser.parseAbsoluteDateTime(input);
    let expected = new Date();
    expected.setDate(6);
    expected.setMonth(3);
    expect(event.toDateString()).toBe(expected.toDateString())
})

test("parseAbsoluteDateTime: date written format without year", () => {
    const input = "Apr 12";
    let event = parser.parseAbsoluteDateTime(input);
    const expectedYear = new Date().getFullYear();
    expect(event.getMonth()).toBe(3);
    expect(event.getDate()).toBe(12);
    expect(event.getFullYear()).toBe(expectedYear);
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
    const input = "April 12 to April 20";
    const currentYear = new Date().getFullYear();
    let expectedBegin = new Date("April 12");
    expectedBegin.setFullYear(currentYear);
    let expectedEnd = new Date("April 20");
    expectedEnd.setFullYear(currentYear);
    
    parser.parseDateTimeRange(input);
    expect(parser.getEventBegin().toDateString()).toBe(expectedBegin.toDateString());
    expect(parser.getEventEnd().toDateString()).toBe(expectedEnd.toDateString());
})