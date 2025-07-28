1.What it does
Takes a set of (x, y) points in JSON format, where y is encoded in a given base.
Converts each (base, value) pair to decimal.
Uses Lagrange Interpolation on all k-combinations of points to recover the constant term c of the polynomial.
Returns the most frequent c across all combinations — the assumed correct secret.
2.Features
Supports multiple inputs via JSON.
Handles large numbers using BigInt.
Simple brute-force approach to understand the core concept behind Shamir's scheme.
