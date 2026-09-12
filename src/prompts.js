import {
    select,
    input,
    confirm
} from "@inquirer/prompts";

import { templates } from "./templates.js";

export async function askTemplate() {
    return select({
        message: "What do you want to initialize?",
        choices: templates.map((template) => ({
            name: template.name,
            value: template.value,
            description: template.description
        }))
    });
}

export async function askProjectName() {
    return input({
        message: "What is your project name?",
        default: "my-project",

        validate(value) {
            const projectName = value.trim();

            if (!projectName) {
                return "Project name is required.";
            }

            if (!/^[a-zA-Z0-9._-]+$/.test(projectName)) {
                return "Use only letters, numbers, dots, hyphens and underscores.";
            }

            return true;
        }
    });
}

export async function askInstallDependencies() {
    return confirm({
        message: "Do you want to install dependencies?",
        default: true
    });
}