import { readFileSync } from "node:fs";
import { parse } from "yaml";

const dependabotPath = new URL("../.github/dependabot.yml", import.meta.url);
const config = parse(readFileSync(dependabotPath, "utf8"));
const npmUpdate = config.updates.find(
  (update) => update["package-ecosystem"] === "npm" && update.directory === "/",
);
const nodeTypesGuard = npmUpdate?.ignore?.find(
  (rule) => rule["dependency-name"] === "@types/node",
);

if (
  !nodeTypesGuard ||
  JSON.stringify(nodeTypesGuard["update-types"]) !==
    JSON.stringify(["version-update:semver-major"])
) {
  throw new Error(
    "Dependabot must ignore only semver-major updates for @types/node",
  );
}

console.log("Dependabot keeps @types/node on the Node 22 major");
