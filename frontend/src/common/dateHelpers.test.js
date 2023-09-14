import { getPreviousNumDays, getDayOfWeek, getCurrentDate, getNextNumDays, getDateRange } from "./dateHelpers"; // change `yourHelperFile` to your actual file name
import { addDays, format, parseISO, subDays, toDate } from "date-fns";

describe("Date Helper Functions", () => {
	describe("getCurrentDate()", () => {
		it("should return today's date in format 'yyyy-mm-dd'", () => {
			const today = new Date();
			const expected = format(today, "yyyy-MM-dd");
			const result = getCurrentDate();
			expect(result).toBe(expected);
			expect(result.length).toBe(10);
		});
	});

	describe("getPreviousNumDays()", () => {
		it("should return an array of dates from the specified number of days before the given date to the given date", () => {
			const result = getPreviousNumDays("2023-09-10", 2);
			expect(result).toEqual([
				format(parseISO("2023-09-08"), "yyyy-MM-dd"),
				format(parseISO("2023-09-09"), "yyyy-MM-dd"),
				format(parseISO("2023-09-10"), "yyyy-MM-dd")
			]);
		});
		it("works when 1st date is beginning of month", () => {
			const result = getPreviousNumDays("2023-03-01", 2);
			expect(result).toEqual([
				format(parseISO("2023-02-27"), "yyyy-MM-dd"),
				format(parseISO("2023-02-28"), "yyyy-MM-dd"),
				format(parseISO("2023-03-01"), "yyyy-MM-dd")
			]);
		});
		it("works when the num is 0", () => {
			const result = getPreviousNumDays("2023-02-28", 0);
			expect(result).toEqual([format(parseISO("2023-02-28"), "yyyy-MM-dd")]);
		});
	});

	describe("getNextNumDays()", () => {
		it("should return an array of dates from the given date to the specified number of days after the given date", () => {
			const result = getNextNumDays("2023-09-10", 2);
			expect(result).toEqual([
				format(parseISO("2023-09-11"), "yyyy-MM-dd"),
				format(parseISO("2023-09-12"), "yyyy-MM-dd")
			]);
		});

		it("works when 1st date is end of month", () => {
			const result = getNextNumDays("2023-02-28", 2);
			expect(result).toEqual([
				format(parseISO("2023-03-01"), "yyyy-MM-dd"),
				format(parseISO("2023-03-02"), "yyyy-MM-dd")
			]);
		});
		it("returns empty array when num is 0", () => {
			const result = getNextNumDays("2023-02-28", 0);
			expect(result).toEqual([]);
		});
		it("works when the num is 1", () => {
			const result = getNextNumDays("2023-02-28", 1);
			expect(result).toEqual([format(parseISO("2023-03-01"), "yyyy-MM-dd")]);
		});
	});

	describe("getDayOfWeek()", () => {
		it("should return the day of the week for the given date", () => {
			const result = getDayOfWeek("2023-09-10");
			expect(result).toBe("Sun");
		});
		it("should return the day of the week for a past date", () => {
			const result = getDayOfWeek("1000-09-10");
			expect(result).toBe("Wed");
		});
		it("should return the day of the week for a future date", () => {
			const result = getDayOfWeek("3000-09-10");
			expect(result).toBe("Wed");
		});
	});

	describe("getDateRange()", () => {
		it("should return the date range for the StreakSlider when the 'date' is today", () => {
			const today = new Date();
			const dateString = format(today, "yyyy-MM-dd");
			const result = getDateRange(dateString);
			// This one is more complex, you might want to set a specific test scenario
			// For now, just checking if it's an array of length 61 (30 days before, current day, 30 days after)
			expect(result).toHaveLength(31);
			expect(result[30]).toEqual(dateString);
		});
		it("should return the date range for the StreakSlider when the 'date' is yesterday", () => {
			const today = new Date();
			const todayString = format(today, "yyyy-MM-dd");
			const dateString = subDays(todayString, 1);
			const result = getDateRange(dateString);
			// This one is more complex, you might want to set a specific test scenario
			// For now, just checking if it's an array of length 61 (30 days before, current day, 30 days after)
			expect(result).toHaveLength(32);
			expect(result[31]).toEqual(todayString);
		});
		it("should return a RangeError when the date is in the future", () => {
			const today = new Date();
			const todayString = format(today, "yyyy-MM-dd");
			const dateString = addDays(todayString, 1);
			const result = getDateRange(dateString);
			// This one is more complex, you might want to set a specific test scenario
			// For now, just checking if it's an array of length 61 (30 days before, current day, 30 days after)
			expect(result).toBeInstanceOf(RangeError);
		});
		it("should return the date range for the StreakSlider when the 'date' is 30 days or less in the past", () => {
			const today = new Date();
			const todayString = format(today, "yyyy-MM-dd");
			const dateString = subDays(todayString, 15);
			const result = getDateRange(dateString);
			// This one is more complex, you might want to set a specific test scenario
			// For now, just checking if it's an array of length 61 (30 days before, current day, 30 days after)
			expect(result).toHaveLength(46);
			expect(result[45]).toEqual(todayString);
		});
		it("should return the date range for the StreakSlider when the 'date' is more than 30 days in the past", () => {
			const today = new Date();
			const todayString = format(today, "yyyy-MM-dd");
			const dateString = subDays(todayString, 60);
			const result = getDateRange(dateString);
			// This one is more complex, you might want to set a specific test scenario
			// For now, just checking if it's an array of length 61 (30 days before, current day, 30 days after)
			expect(result).toHaveLength(61);
			expect(result[30]).toEqual(dateString);
		});
	});
});
