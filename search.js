import fs from "fs";

const fileIndex = JSON.parse(fs.readFileSync("./fileIndex.json", "utf-8"));
let queryArray = process.argv.slice(2, process.argv.length);
let limit = queryArray.length;
queryArray.forEach((query) => queryArray.push(query.toLowerCase()));
queryArray.splice(0, limit);

if (fileIndex[queryArray[0]] === undefined) {
	console.log("Query not found");
	process.exit();
}

let sharedFilesSingleQuery = fileIndex[queryArray[0]].files;
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
		let count = 0;
		for (let i = 0; i < queryArray.length - 1; i++) {
			let wordPos = fileIndex[queryArray[i]].files[sharedFiles[index]];
			let nextWordPos =
				fileIndex[queryArray[i + 1]].files[sharedFiles[index]];
			for (let posIndex = 0; posIndex < wordPos.length; posIndex++) {
				if (nextWordPos.includes(wordPos[posIndex] + 1)) {
					count++;
				}
			}
		}
        console.log(sharedFiles[index], "found", count, "times");
	}
} else {
	const fileArray = Object.entries(sharedFilesSingleQuery);
	fileArray.forEach(([fileName, occurrences]) => {
		console.log(fileName, "found " + occurrences.length + " times");
	});
}
