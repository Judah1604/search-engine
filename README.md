# Search Engine

A search engine built from scratch. No search libraries, no external indexing tools. Just tokenization, an inverted index, and TF-IDF, built to actually understand how search works underneath the abstractions.

## What it does

Point it at a folder of text files, then search them by word or phrase.

```bash
node search.js quantum
node search.js quantum computers
```

Results are ranked by relevance, not just raw occurrence count.

## How it works

**1. Indexing**

Every file is read once, tokenized (split on non-word characters, lowercased, punctuation stripped), and recorded into an inverted index: a mapping from word to the files it appears in, and the exact word positions within each file.

```
"quantum" -> { files: { "doc1.txt": [0], "doc4.txt": [0] } }
```

The index is built once and persisted to `fileIndex.json`. Searching never re-reads or re-scans the original files.

**2. Single-word search**

A direct lookup into the index. No scanning required.

**3. Phrase search**

Multi-word queries are matched using word positions, not independent word lookups. A query like `quantum computers may` only matches if all three words appear as one continuous run, not just somewhere in the same file. This is checked by tracking candidate starting positions and requiring every consecutive word in the query to sit exactly one position after the last.

**4. Ranking (TF-IDF)**

Results are scored using term frequency times inverse document frequency, so a word's rarity across the whole document set matters, not just how many times it shows up in one file.

```
score = occurrences_in_file x IDF(word)
IDF(word) = log(total_files / files_containing_word)
```

For multi-word queries, the score uses the **minimum IDF** across all query words. A phrase is only as distinctive as its most common word, if one word in the phrase appears everywhere, the whole phrase shouldn't rank highly just because the other words are rare.

## Usage

Build the index:

```bash
node build-index.js
```

Search:

```bash
node search.js <word or phrase>
```

Output includes match count and relevance score per file, sorted highest first.

## What's not in here (yet)

- AND/OR query logic (currently exact-phrase matching only for multi-word queries)
- Persisted, on-disk IDF caching (recalculated at search time from the index)
- A TUI (this is a CLI script, on purpose, for now)

## Why

Built as an exercise in reading Node.js docs, understanding data structures, and fighting through real bugs, shadowed variables, wrong-level object nesting, boolean coercion tricks, and the difference between independent pairwise matches and true positional phrase chaining, rather than reaching for a library that does all of this invisibly.
