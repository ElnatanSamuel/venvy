import { BaseValidator, ValidationError } from "./types.js";

export class StringValidator extends BaseValidator<string> {
  private _minLength?: number;
  private _regex?: RegExp;

  minLength(length: number): this {
    this._minLength = length;
    return this;
  }

  regex(pattern: RegExp): this {
    this._regex = pattern;
    return this;
  }

  validate(
    key: string,
    value: string | undefined,
    allVars: Record<string, string>,
  ): ValidationError | string {
    const isRequired =
      this._required || (this._condition && this._condition(allVars));

    if (value === undefined || value === "") {
      if (this._default !== undefined) return this._default;
      if (isRequired) return { key, message: "Variable is required" };
      return "";
    }

    if (this._minLength !== undefined && value.length < this._minLength) {
      return {
        key,
        message: `Minimum length is ${this._minLength}`,
        received: value.length,
      };
    }

    if (this._regex !== undefined && !this._regex.test(value)) {
      return { key, message: "Value does not match pattern", received: value };
    }

    return value;
  }
}

export class NumberValidator extends BaseValidator<number> {
  validate(
    key: string,
    value: string | undefined,
    allVars: Record<string, string>,
  ): ValidationError | number {
    const isRequired =
      this._required || (this._condition && this._condition(allVars));

    if (value === undefined || value === "") {
      if (this._default !== undefined) return this._default;
      if (isRequired) return { key, message: "Variable is required" };
      return 0;
    }

    const parsed = Number(value);
    if (isNaN(parsed)) {
      return { key, message: "Invalid number", received: value };
    }

    return parsed;
  }
}

export class BooleanValidator extends BaseValidator<boolean> {
  validate(
    key: string,
    value: string | undefined,
    allVars: Record<string, string>,
  ): ValidationError | boolean {
    const isRequired =
      this._required || (this._condition && this._condition(allVars));

    if (value === undefined || value === "") {
      if (this._default !== undefined) return this._default;
      if (isRequired) return { key, message: "Variable is required" };
      return false;
    }

    if (value.toLowerCase() === "true" || value === "1") return true;
    if (value.toLowerCase() === "false" || value === "0") return false;

    return { key, message: "Invalid boolean", received: value };
  }
}

export class EnumValidator<T extends string> extends BaseValidator<T> {
  constructor(private options: T[]) {
    super();
  }

  validate(
    key: string,
    value: string | undefined,
    allVars: Record<string, string>,
  ): ValidationError | T {
    const isRequired =
      this._required || (this._condition && this._condition(allVars));

    if (value === undefined || value === "") {
      if (this._default !== undefined) return this._default;
      if (isRequired) return { key, message: "Variable is required" };
      return this.options[0];
    }

    if (!this.options.includes(value as T)) {
      return {
        key,
        message: `Must be one of: ${this.options.join(", ")}`,
        received: value,
      };
    }

    return value as T;
  }
}

export class URLValidator extends BaseValidator<string> {
  validate(
    key: string,
    value: string | undefined,
    allVars: Record<string, string>,
  ): ValidationError | string {
    const isRequired =
      this._required || (this._condition && this._condition(allVars));

    if (value === undefined || value === "") {
      if (this._default !== undefined) return this._default;
      if (isRequired) return { key, message: "Variable is required" };
      return "";
    }

    try {
      new URL(value);
      return value;
    } catch {
      return { key, message: "Invalid URL", received: value };
    }
  }
}

export class EmailValidator extends StringValidator {
  validate(
    key: string,
    value: string | undefined,
    allVars: Record<string, string>,
  ): ValidationError | string {
    const result = super.validate(key, value, allVars);
    if (typeof result === "object" && "message" in result) return result;

    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return { key, message: "Invalid email address", received: value };
    }
    return result as string;
  }
}

export class IPValidator extends StringValidator {
  validate(
    key: string,
    value: string | undefined,
    allVars: Record<string, string>,
  ): ValidationError | string {
    const result = super.validate(key, value, allVars);
    if (typeof result === "object" && "message" in result) return result;

    if (value && !/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(value)) {
      return { key, message: "Invalid IP address", received: value };
    }
    return result as string;
  }
}

export class PortValidator extends NumberValidator {
  validate(
    key: string,
    value: string | undefined,
    allVars: Record<string, string>,
  ): ValidationError | number {
    const result = super.validate(key, value, allVars);
    if (typeof result === "object" && "message" in result) return result;

    const port = result as number;
    if (port < 1 || port > 65535) {
      return {
        key,
        message: "Port must be between 1 and 65535",
        received: port,
      };
    }
    return port;
  }
}

export const string = () => new StringValidator();
export const number = () => new NumberValidator();
export const boolean = () => new BooleanValidator();
export const url = () => new URLValidator();
export const enumeration = <T extends string>(options: T[]) =>
  new EnumValidator(options);
export const email = () => new EmailValidator();
export const ip = () => new IPValidator();
export const port = () => new PortValidator();
