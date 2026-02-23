import { Config } from "@rbxts/jest";
import setupTestsModule from "./jest.setup";

export = {
	testMatch: ["**/*.spec"],
	setupFiles: [setupTestsModule],
} satisfies Config;
