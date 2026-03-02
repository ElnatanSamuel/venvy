import { describe, it, expect, vi } from "vitest";
import { string, number, boolean, } from "../src/core/validator";
import { defineEnv } from "../src/core/schema";
describe("Venvy Validator", () => {
    it("should validate string with minLength", () => {
        const validator = string().minLength(5);
        expect(validator.validate("TEST", "abcde")).toBe("abcde");
        const error = validator.validate("TEST", "abc");
        expect(typeof error).toBe("object");
        if (typeof error === "object") {
            expect(error.message).toContain("Minimum length is 5");
        }
    });
    it("should validate numbers", () => {
        const validator = number();
        expect(validator.validate("PORT", "3000")).toBe(3000);
        const error = validator.validate("PORT", "abc");
        expect(typeof error).toBe("object");
    });
    it("should validate booleans", () => {
        const validator = boolean();
        expect(validator.validate("DEBUG", "true")).toBe(true);
        expect(validator.validate("DEBUG", "0")).toBe(false);
    });
});
describe("defineEnv", () => {
    it("should throw error and exit on missing required variable", () => {
        const mockExit = vi.spyOn(process, "exit").mockImplementation(() => {
            throw new Error("exit");
        });
        const mockConsoleError = vi
            .spyOn(console, "error")
            .mockImplementation(() => { });
        expect(() => {
            defineEnv({
                MISSING: string().required(),
            });
        }).toThrow("exit");
        expect(mockExit).toHaveBeenCalledWith(1);
        expect(mockConsoleError).toHaveBeenCalled();
        mockExit.mockRestore();
        mockConsoleError.mockRestore();
    });
});
