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
				wordItem.files[fileName].push(i);
			} else {
				wordItem.files[fileName] = [i];
			}
		} else {
			fileIndex[word] = { files: {} };
			fileIndex[word].files[fileName] = [i];
		}
	}
}

fs.writeFileSync('./fileIndex.json', JSON.stringify(fileIndex))

// console.log(fileIndex);
