import fs from "fs";

const files = fs.readdirSync("./files");

const query = "It";

for (let index = 0; index < files.length; index++) {
	let occurences = 0;
	const cleanedQuery = query.trim().toLowerCase();
    const fileName = files[index]
	const fileContent = fs.readFileSync(`./files/${fileName}`, 'utf8');
	const words = fileContent.trim().toLowerCase().split(/\W+/).filter(Boolean);
    console.log(words)

	for (let index = 0; index < words.length; index++) {
		if (words[index] === cleanedQuery) {
			occurences++;
		}
	}

    console.log(fileName, occurences + ' times')
}
