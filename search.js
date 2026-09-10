import fs from "fs";

const fileIndex = JSON.parse(fs.readFileSync("./fileIndex.json", "utf-8"));

const queryArray = process.argv.slice(2, process.argv.length);
const query = queryArray.join(" ").toLowerCase().trim();
console.log(query);

const results = fileIndex[query];

if (results == undefined) {
	console.log(query, "not found");
} else {
	const resultedFiles = Object.entries(fileIndex[query].files).sort(
		(a, b) => b[1] - a[1],
	);
	resultedFiles.forEach(([fileName, occurrence]) =>
		console.log(query, "in", fileName, "found", occurrence, "times"),
	);
}
