import fs from "fs";
import { GENERATED_MOCK } from "./constant";

fs.readdirSync(GENERATED_MOCK).forEach((file) => {
  console.log(file);
});
