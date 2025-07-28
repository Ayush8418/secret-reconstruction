// // Convert string in base "b" to decimal number
// function convertToDecimal(value, base) {
//     let result = 0n; // Use BigInt
//     for (let digit of value) {
//         result = result * BigInt(base) + BigInt(parseInt(digit, base));
//     }
//     return result;
// }

// // Lagrange interpolation to find f(0) (constant term)
// function lagrangeInterpolationAtZero(points) {
//     let result = 0;

//     for (let i = 0; i < points.length; i++) {
//         const xi = Number(points[i][0]);
//         const yi = Number(points[i][1]);

//         let term = yi;
//         for (let j = 0; j < points.length; j++) {
//             if (i !== j) {
//                 const xj = Number(points[j][0]);
//                 term *= (-xj) / (xi - xj);
//             }
//         }
//         result += term;
//     }

//     return Math.round(result); // Rounded to nearest integer
// }

// // Generate all combinations of size k from array
// function getCombinations(arr, k) {
//     const result = [];

//     function backtrack(start, combo) {
//         if (combo.length === k) {
//             result.push([...combo]);
//             return;
//         }
//         for (let i = start; i < arr.length; i++) {
//             combo.push(arr[i]);
//             backtrack(i + 1, combo);
//             combo.pop();
//         }
//     }

//     backtrack(0, []);
//     return result;
// }

// // Main function
// function findSecret(input, k) {
//     // Step 1: Convert to points
//     const points = [];
//     for (const key in input) {
//         if (key === "keys") continue;
//         const x = BigInt(key);
//         const base = parseInt(input[key].base);
//         const valueStr = input[key].value;
//         const y = convertToDecimal(valueStr, base);
//         points.push([x, y]);
//     }

//     // Step 2: Generate combinations
//     const combos = getCombinations(points, k);

//     // Step 3: Lagrange interpolation for each combo
//     const freq = new Map();
//     for (const group of combos) {
//         const c = lagrangeInterpolationAtZero(group);
//         freq.set(c, (freq.get(c) || 0) + 1);
//     }

//     // Step 4: Most frequent constant term
//     let secret = -1;
//     let maxCount = 0;
//     for (const [c, count] of freq.entries()) {
//         if (count > maxCount) {
//             maxCount = count;
//             secret = c;
//         }
//     }

//     console.log("The secret (constant term) is:", secret);
//     return secret;
// }

// // 🧪 Example Input
// const input1 = {
//     keys: { n: 4, k: 3 },
//     "1": { base: "10", value: "4" },
//     "2": { base: "2", value: "111" },
//     "3": { base: "10", value: "12" },
//     "6": { base: "4", value: "213" }
// };

// findSecret(input1, input1.keys.k);

const fs = require("fs");

// Convert string in base "b" to decimal number (BigInt)
function convertToDecimal(value, base) {
    let result = 0n;
    for (let digit of value) {
        result = result * BigInt(base) + BigInt(parseInt(digit, base));
    }
    return result;
}

// Lagrange interpolation to find f(0) (constant term)
function lagrangeInterpolationAtZero(points) {
    let result = 0;

    for (let i = 0; i < points.length; i++) {
        const xi = Number(points[i][0]);
        const yi = Number(points[i][1]);

        let term = yi;
        for (let j = 0; j < points.length; j++) {
            if (i !== j) {
                const xj = Number(points[j][0]);
                term *= (-xj) / (xi - xj);
            }
        }
        result += term;
    }

    return Math.round(result); // Rounded to nearest integer
}

// Generate all combinations of size k from array
function getCombinations(arr, k) {
    const result = [];

    function backtrack(start, combo) {
        if (combo.length === k) {
            result.push([...combo]);
            return;
        }
        for (let i = start; i < arr.length; i++) {
            combo.push(arr[i]);
            backtrack(i + 1, combo);
            combo.pop();
        }
    }

    backtrack(0, []);
    return result;
}

// Main function for each input object
function findSecret(input, k) {
    const points = [];

    for (const key in input) {
        if (key === "keys") continue;
        const x = BigInt(key);
        const base = parseInt(input[key].base);
        const valueStr = input[key].value;
        const y = convertToDecimal(valueStr, base);
        points.push([x, y]);
    }

    const combos = getCombinations(points, k);

    const freq = new Map();
    for (const group of combos) {
        const c = lagrangeInterpolationAtZero(group);
        freq.set(c, (freq.get(c) || 0) + 1);
    }

    let secret = -1;
    let maxCount = 0;
    for (const [c, count] of freq.entries()) {
        if (count > maxCount) {
            maxCount = count;
            secret = c;
        }
    }

    return secret;
}

// 🔄 Read JSON from file and process each input
const inputFile = "input.json";

try {
    const rawData = fs.readFileSync(inputFile);
    const allInputs = JSON.parse(rawData);

    for (const key in allInputs) {
        const input = allInputs[key];
        const k = input.keys.k;
        const secret = findSecret(input, k);
        console.log(`${key}: The secret (constant term) is ${secret}`);
    }
} catch (error) {
    console.error("Error reading or processing input file:", error.message);
}
