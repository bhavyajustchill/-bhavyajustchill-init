#!/usr/bin/env node

import { run } from "../src/project.js";

run().catch((error) => {
    console.error("\nSomething went wrong.\n");

    if (error?.shortMessage) {
        console.error(error.shortMessage);
    } else if (error?.message) {
        console.error(error.message);
    }

    process.exit(1);
});