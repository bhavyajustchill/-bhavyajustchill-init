import path from "node:path";
import fs from "node:fs/promises";

import chalk from "chalk";
import { execa } from "execa";

import { showBanner } from "./banner.js";
import { templates } from "./templates.js";
import {
    askTemplate,
    askProjectName,
    askInstallDependencies
} from "./prompts.js";

import {
    pathExists,
    getProjectPath
} from "./utils.js";

function getTemplateByValue(value) {
    return templates.find(
        (template) => template.value === value
    );
}

async function cloneTemplate(repository, projectPath) {
    await execa(
        "git",
        [
            "clone",
            repository,
            projectPath
        ],
        {
            stdio: "inherit"
        }
    );
}

async function removeGitDirectory(projectPath) {
    const gitDirectory = path.join(projectPath, ".git");

    if (await pathExists(gitDirectory)) {
        await fs.rm(gitDirectory, {
            recursive: true,
            force: true
        });
    }
}

async function initializeGit(projectPath) {
    await execa(
        "git",
        ["init"],
        {
            cwd: projectPath,
            stdio: "inherit"
        }
    );
}

async function installDependencies(projectPath) {
    await execa(
        "npm",
        ["install"],
        {
            cwd: projectPath,
            stdio: "inherit"
        }
    );
}

function success(message) {
    console.log(chalk.green(`✔ ${message}`));
}

function info(message) {
    console.log(chalk.cyan(`ℹ ${message}`));
}

export async function run() {
    await showBanner();

    const templateValue = await askTemplate();

    const template = getTemplateByValue(templateValue);

    if (!template) {
        throw new Error("Invalid template selected.");
    }

    const projectName = await askProjectName();

    const projectPath = getProjectPath(projectName);

    console.log();

    if (await pathExists(projectPath)) {
        throw new Error(
            `The directory "${projectName}" already exists.`
        );
    }

    const installDependenciesChoice =
        await askInstallDependencies();

    console.log();

    info(`Creating ${projectName}...`);

    await cloneTemplate(
        template.repository,
        projectPath
    );

    success("Template cloned.");

    await removeGitDirectory(projectPath);

    success("Template Git history removed.");

    await initializeGit(projectPath);

    success("New Git repository initialized.");

    if (installDependenciesChoice) {
        console.log();
        info("Installing dependencies...");

        await installDependencies(projectPath);

        success("Dependencies installed.");
    }

    console.log();
    console.log(
        chalk.green.bold("✔ Project created successfully!")
    );

    console.log();

    console.log(chalk.cyan("Next steps:"));
    console.log();

    console.log(`  ${chalk.white(`cd ${projectName}`)}`);

    if (!installDependenciesChoice) {
        console.log(`  ${chalk.white("npm install")}`);
    }

    console.log(`  ${chalk.white("npm run dev")}`);

    console.log();
}