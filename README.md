# Rotate square matrix

### Install dependencies
```console
npm install
```

### Run tests
Currently there is only one high level test impemented, that simply checks the output of command agains the execpted one.

There are no unit tests added for helper functions.

```console
node test.js
```

### Run the script
```console
node rotate.js testData.csv
```

### Notes
Initially I solved the core logic of challenge(`rotateMatrix` function) in Python and then basically translated the code to JS.
That's why I wrote function `range`, it's written as a generator to avoid too much waste of space.

### To-Do
- No real benchmarking was done
- Unit tests are missing
- No code linting was done
