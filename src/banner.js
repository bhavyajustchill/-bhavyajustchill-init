import figlet from "figlet";
import chalk from "chalk";

export async function showBanner() {
    const banner = await figlet.text("BhavyaJustChill");

    console.log();
    console.log(chalk.cyan(banner));
    console.log();
}

showBanner();