const fs = require('fs');
const csv = require('fast-csv');

/** https://gist.github.com/earthtone/a96585a71cae0c50d799f8782c3ee564#file-pipe-js */
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);
function* range(start, end, step = 1) {
    if (step > 0) {
        for (let i = start; i <= end; i += step) {
            yield i;
        }
    } else {
        for (let i = start; i >= end; i += step) {
            yield i;
        }
    }
}

const arrayToMatrix = (arr, n) => {
    const twoDArray = [];
    for (const i of range(0, arr.length - 1, n)) {
        twoDArray.push(arr.slice(i, i + n));
    }
    return twoDArray;
}

const arrayToList = matrix => {
    const list = [];
    for (const row of matrix) {
        for (const col of row) {
            list.push(col);
        }
    }

    return list;
}

const rotateMatrix = matrix => {
    let top = 0;
    let bottom = matrix.length - 1;
    let left = 0;
    let right = matrix[0].length - 1;


    while (left < right && top < bottom) {
        let prev = matrix[top + 1][left]

        for (const i of range(left, right)) {
            let curr = matrix[top][i];
            matrix[top][i] = prev;
            prev = curr;
        }

        top += 1;
        for (const i of range(top, bottom)) {
            let curr = matrix[i][right];
            matrix[i][right] = prev;
            prev = curr;
        }

        right -= 1;
        for (const i of range(right, left, -1)) {
            let curr = matrix[bottom][i];
            matrix[bottom][i] = prev;
            prev = curr;
        }

        bottom -= 1;
        for (const i of range(bottom, top, -1)) {
            let curr = matrix[i][left];
            matrix[i][left] = prev;
            prev = curr;
        }
        left += 1
    }

    return matrix
}

const canBeSquarMatrix = arr => {
    const sqrt = Math.sqrt(arr.length);
    return Math.floor(sqrt) == sqrt && arr.length > 0;
}

const transform = arr => {
    if (canBeSquarMatrix(arr)) {
        const matrix = arrayToMatrix(arr, Math.sqrt(arr.length));
        return rotateMatrix(matrix);
    }
    return [];
}

const decode = inputString => {
    if (inputString.length == 0) {
        return [];
    }
    const jsObj = JSON.parse(inputString);
    const result = [];
    for (const el of jsObj) {
        result.push(el);
    }

    return result;
}

const transformationPipeline = data => pipe(decode, transform, arrayToList)(data);

const run = () => {
    const args = process.argv.slice(2);
    if (args.length == 0) {
        console.error("Expected usage node rotate.js <pathToInputFile>");
    }
    const filePath = args[0];
    try {
        if (fs.existsSync(filePath)) {
            fs.createReadStream(filePath)
                .pipe(csv.parse({ headers: true }))
                .pipe(csv.format({ headers: true }))
                .transform(data => ({
                    id: data["id"],
                    json: JSON.stringify(transformationPipeline(data["json"])),
                    is_valid: canBeSquarMatrix(decode(data["json"]))
                }))
                .pipe(process.stdout)
                .on('end', () => process.exit());

        }
    } catch (err) {
        console.error(err);
    }
}

run();
