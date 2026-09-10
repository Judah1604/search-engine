import fs from "fs";
let fileIndex = {};

const files = fs.readdirSync("./files");

for (let index = 0; index < files.length; index++) {
	const fileName = files[index];
	const fileContent = fs.readFileSync(`./files/${fileName}`, "utf8");
	const words = fileContent.trim().toLowerCase().split(/\W+/).filter(Boolean);

	for (let i = 0; i < words.length; i++) {
		const word = words[i];

		if (word in fileIndex) {
			const wordItem = fileIndex[word];

			if (fileName in wordItem.files) {
				wordItem.files[fileName]++;
			} else {
				wordItem.files[fileName] = 1;
			}
		} else {
			fileIndex[word] = { files: {} };
			fileIndex[word].files[fileName] = 1;
		}

        // if (queryArray.length === 1) {
		// 	for (let index = 0; index < words.length; index++) {
		// 		if (words[index] === query) {
		// 			occurences++;
		// 		}
		// 	}
		// } else {
		// 	for (
		// 		let index = 0;
		// 		index < words.length - queryArray.length;
		// 		index++
		// 	) {
		// 		let chunk = words
		// 			.slice(index, index + queryArray.length)
		// 			.join(" ");
		// 		if (chunk === query) {
		// 			occurences++;
		// 		}
		// 	}
		// }

	}
}

fs.writeFileSync('./fileIndex.json', JSON.stringify(fileIndex))

console.log(fileIndex);
