Defining rhyme schemes

A rhyme scheme is something like

```
ABAB
```

where each letter represents a line.

All lines marked by `A` rhyme with each other. The same is true for `B`, etc.
In other words, the letter marks the group the line belongs to.

For our purposes, we assume rhyming is transitive. In other words, if "hat"
rhymes with "cat", and "cat" rhymes with "bat", then "hat" rhymes with "bat".

This may not be a good assumption for near rhymes. It may be possible to run
into a `dialect continuum` problem, where the each word is a near rhyme with its
neighbors, but the words at the beginning and end of the continuum are not near
rhymes.

E.g., paint -> sprained -> sprayed -> spread

Each word is a near rhyme of its neighbors, but "paint" and "spread" are
not near rhymes.

This observation could be a way to distinguish near rhymes and perfect rhymes.

An algorithm for labeling rhyme schemes:

```
mark line 0 with `A`
if line 1 rhymes with line 0
  give it the same label as line 0
else
  give it an unused label

if line 2 rhymes with line 0
  give it the same label as line 0
else if line 2 rhymes with line 1
  give it the same label as line 1
else
  give it an unused label

etc.
```

More generally:

```
mark line 0 with `A`

for each following line
  let line_i be the ith line
  let line_rhyme be the first line between line_0 and line_i-1 that rhymes
    with line_i
  if no line rhymes with line_i
    give line_i an unused label
  else
    give line_i the same label as line_rhyme
```
