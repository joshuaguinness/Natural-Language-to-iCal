const parser = require("./parser");

// TODO: Create tests for regex

// setDateByDayOfWeek tests
test("setDateByDayOfWeek: set to next Monday", () => {
    const referenceDate = new Date("April 12, 2021 09:00:00"); // Monday
    const dayMatchArray = ["mon", "monday"];
    let date = new Date("April 12, 2021 09:00:00");
    let event = parser.setDateByDayOfWeek(date, dayMatchArray, referenceDate);
    expect(event.getDate()).toBe(19);
});
