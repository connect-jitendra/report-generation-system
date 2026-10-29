import generateCSV from "../src/modules/reports/generators/csv.generator.js";

const users = [
    { id: 101, name: "Rahul", role: "admin" },
    { id: 102, name: "Priya", role: "manager" },
    { id: 103, name: "Amit", role: "user" }
];

const result = await generateCSV(users);
console.log(result);