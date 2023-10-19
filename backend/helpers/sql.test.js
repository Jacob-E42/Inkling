const { objectDataToSql } = require("./sql");

describe("objectDataToSql", function () {
	test("works: 1 item", function () {
		const result = objectDataToSql({ f1: "v1" });
		expect(result).toEqual({
			setCols: '"f1"=$1',
			values: ["v1"]
		});
	});

	test("works: 2 items", function () {
		const result = objectDataToSql({ f1: "v1", jsF2: "v2" });
		expect(result).toEqual({
			setCols: '"f1"=$1, "jsF2"=$2',
			values: ["v1", "v2"]
		});
	});

	test("works: firstName", function () {
		const result = objectDataToSql({ f1: "v1", firstName: "v2" });
		expect(result).toEqual({
			setCols: '"f1"=$1, "first_name"=$2',
			values: ["v1", "v2"]
		});
	});
	test("works: journalType", function () {
		const result = objectDataToSql({ f1: "v1", journalType: "v2" });
		expect(result).toEqual({
			setCols: '"f1"=$1, "journal_type"=$2',
			values: ["v1", "v2"]
		});
	});
});
