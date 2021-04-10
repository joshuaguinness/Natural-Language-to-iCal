const parser = require("./parser");

// TODO: Create tests for regex
// TODO: Create tests for end date before start date

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

test("parseAbsoluteDateTime: test error handling", () => {
    const input = "test";
    let event = parser.parseAbsoluteDateTime(input);
    const expected = "<span class=\"output-error\">Could not parse <i>test</i> as a date (Error D2)</span>";
    expect(event).toBe(expected);
})