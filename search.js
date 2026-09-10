import fs from "fs";

const fileIndex = JSON.parse(fs.readFileSync("./fileIndex.json", "utf-8"));
const queryArray = process.argv.slice(2, process.argv.length);
let matchedFiles = [];

if (fileIndex[queryArray[0]] === undefined) {
	console.log("Query not found");
	process.exit();
}

let sharedFiles = Object.keys(fileIndex[queryArray[0]].files);

if (queryArray.length > 1) {
	for (let queryIndex = 1; queryIndex < queryArray.length; queryIndex++) {
		const query = queryArray[queryIndex];

		if (fileIndex[query] === undefined) {
			console.log("Query not found");
			sharedFiles = [];
			break;
		}

		sharedFiles = sharedFiles.filter((file) =>
			Object.keys(fileIndex[query].files).includes(file),
		);
	}
	for (let index = 0; index < sharedFiles.length; index++) {
		let word1Positions = fileIndex[queryArray[0]].files[sharedFiles[index]];
		let word2Positions = fileIndex[queryArray[1]].files[sharedFiles[index]];

		for (let posIndex = 0; posIndex < word1Positions.length; posIndex++) {
			if (word2Positions.includes(word1Positions[posIndex] + 1)) {
				matchedFiles.push(sharedFiles[index]);
				break;
			}
		}
	}
} else {
	console.log(sharedFiles);
}

console.log(matchedFiles);
