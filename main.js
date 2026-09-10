import fs from "fs";

const files = fs.readdirSync("./files");

const queryArray = process.argv.slice(2, process.argv.length);
const query = queryArray.join(" ").toLowerCase().trim();
console.log(query);
let results = [];

for (let index = 0; index < files.length; index++) {
	let occurences = 0;
	const fileName = files[index];
	const fileContent = fs.readFileSync(`./files/${fileName}`, "utf8");
	const words = fileContent.trim().toLowerCase().split(/\W+/).filter(Boolean);

	if (queryArray.length === 1) {
		for (let index = 0; index < words.length; index++) {
			if (words[index] === query) {
				occurences++;
			}
		}
	} else {
		for (let index = 0; index < words.length - queryArray.length; index++) {
			let chunk = words.slice(index, index + queryArray.length).join(" ");
			if (chunk === query) {
				occurences++;
			}
		}
	}

	results.push({ fileName: fileName, occurences: occurences });
}

results = results
	.filter((result) => result.occurences !== 0)
	.sort((a, b) => b.occurences - a.occurences);

if (results.length === 0) {
	console.log("Found no results.");
} else {
	results.forEach((result) =>
		console.log(result.fileName, "found " + result.occurences + " times"),
	);
}
