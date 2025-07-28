const fs = require("fs");

function toDec(val, base) {
    let res = 0n;
    for (let d of val) {
        res = res * BigInt(base) + BigInt(parseInt(d, base));
    }
    return res;
}

function lagrange(points) {
    let res = 0;
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
        res += term;
    }
    return Math.round(res);
}

function comb(arr, k) {
    const out = [];
    function go(start, cur) {
        if (cur.length === k) {
            out.push([...cur]);
            return;
        }
        for (let i = start; i < arr.length; i++) {
            cur.push(arr[i]);
            go(i + 1, cur);
            cur.pop();
        }
    }
    go(0, []);
    return out;
}

function find(input, k) {
    const pts = [];
    for (const key in input) {
        if (key === "keys") continue;
        const x = BigInt(key);
        const b = parseInt(input[key].base);
        const val = input[key].value;
        const y = toDec(val, b);
        pts.push([x, y]);
    }

    const all = comb(pts, k);
    const freq = new Map();

    for (const grp of all) {
        const c = lagrange(grp);
        freq.set(c, (freq.get(c) || 0) + 1);
    }

    let ans = -1;
    let max = 0;
    for (const [c, cnt] of freq.entries()) {
        if (cnt > max) {
            max = cnt;
            ans = c;
        }
    }

    return ans;
}

const file = "input.json";

try {
    const data = fs.readFileSync(file);
    const all = JSON.parse(data);

    for (const key in all) {
        const inp = all[key];
        const k = inp.keys.k;
        const sec = find(inp, k);
        console.log(`${key}: The secret (constant term) is ${sec}`);
    }
} catch (err) {
    console.error("error:", err.message);
}
