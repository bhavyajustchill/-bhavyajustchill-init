import fs from "node:fs/promises";
import path from "node:path";

export async function pathExists(targetPath) {
    try {
        await fs.access(targetPath);
        return true;
    } catch {
        return false;
    }
}

export function getProjectPath(projectName) {
    return path.resolve(process.cwd(), projectName);
}