import fs from "fs";

const totalFiles = fs.readdirSync("./files").length;
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
let sharedFiles = Object.keys(sharedFilesSingleQuery);

if (queryArray.length > 1) {
	let results = [];

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
		let count = 0,
			file = sharedFiles[index];

		const firstWordPositions =
			fileIndex[queryArray[0]].files[sharedFiles[index]];

		for (let p = 0; p < firstWordPositions.length; p++) {
			const startPos = firstWordPositions[p];
			let isFullMatch = true;

			for (let i = 1; i < queryArray.length; i++) {
				const nextWordPositions =
					fileIndex[queryArray[i]].files[sharedFiles[index]];
				if (
					!nextWordPositions ||
					!nextWordPositions.includes(startPos + i)
				) {
					isFullMatch = false;
					break;
				}
			}

			if (isFullMatch) {
				count++;
			}
		}

		const score = getMinIDF(queryArray) * count;

		if (count > 0) {
			results.push({
				fileName: file,
				score: score,
				occurrences: count,
			});
		}
	}

	results.sort((a, b) => b.score - a.score);

	results.forEach((result) => {
		console.log(
			result.fileName,
			"found " + result.occurrences + " times, score: " + result.score,
		);
	});
} else {
	let results = [];
	const fileArray = Object.entries(sharedFilesSingleQuery);
	for (let index = 0; index < fileArray.length; index++) {
		const file = fileArray[index];
		const score = getIDF(queryArray[0]) * file[1].length;

		results.push({
			fileName: file[0],
			score: score,
			occurrences: file[1].length,
		});
	}

	results.sort((a, b) => b.score - a.score);

	results.forEach((result) => {
		console.log(
			result.fileName,
			"found " + result.occurrences + " times, score: " + result.score,
		);
	});
}

function getIDF(word) {
	const filesContainingWord = Object.keys(fileIndex[word].files).length,
		idf = +Math.log(totalFiles / filesContainingWord).toFixed(2);

	return idf;
}
function getMinIDF(words) {
	let results = [];
	for (let index = 0; index < words.length; index++) {
		const word = words[index];
		results.push(getIDF(word));
	}

	let min = Math.min(...results);

	return min;
}
