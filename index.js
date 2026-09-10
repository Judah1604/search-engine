import fs from "fs";
let fileIndex = {};

let test = {
	word: { fileNames: { doc1: 2, doc2: 1 } },
	quantum: { fileNames: { doc1: 1, doc3: 3 } },
};

const files = fs.readdirSync("./files");

const queryArray = process.argv.slice(2, process.argv.length);
const query = queryArray.join(" ").toLowerCase().trim();
console.log(query);

for (let index = 0; index < files.length; index++) {
	const fileName = files[index];
	const fileContent = fs.readFileSync(`./files/${fileName}`, "utf8");
	const words = fileContent.trim().toLowerCase().split(/\W+/).filter(Boolean);

	for (let i = 0; i < words.length; i++) {
		const word = words[i];

		if (word in fileIndex) {
			const wordItem = fileIndex[word];

			if (fileName in wordItem.fileNames) {
				wordItem.fileNames[fileName]++;
			} else {
				wordItem.fileNames[fileName] = 1;
			}
		} else {
			fileIndex[word] = { fileNames: {} };
			fileIndex[word].fileNames[fileName] = 1;
		}
	}
}

fs.writeFileSync('./fileIndex.json', JSON.stringify(fileIndex))

console.log(fileIndex);
