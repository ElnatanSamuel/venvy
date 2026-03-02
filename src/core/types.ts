export type EnvValue = string | number | boolean;

export type ValidationResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      errors: ValidationError[];
    };

export interface ValidationError {
  key: string;
  message: string;
  received?: any;
}

export abstract class BaseValidator<T extends EnvValue> {
  public _required = false;
  public _default?: T;
  public _description?: string;
  public _condition?: (vars: Record<string, string>) => boolean;

  required(): this {
    this._required = true;
    return this;
  }

  default(value: T): this {
    this._default = value;
    return this;
  }

  description(text: string): this {
    this._description = text;
    return this;
  }

  requiredIf(condition: (vars: Record<string, string>) => boolean): this {
    this._condition = condition;
    return this;
  }

  abstract validate(
    key: string,
    value: string | undefined,
    allVars: Record<string, string>,
  ): ValidationError | T;
}

export type Schema = Record<string, BaseValidator<any>>;

export type InferEnv<S extends Schema> = {
  [K in keyof S]: S[K] extends BaseValidator<infer T> ? T : never;
};
