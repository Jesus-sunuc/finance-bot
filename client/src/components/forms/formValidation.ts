export interface Rules {
  regex?: RegExp;
  max?: number;
  min?: number;
  required?: boolean;
}

export function validate(value: string, rules?: Rules): string {
  if (rules) {
    if (rules.regex) {
      if (!rules.regex.test(value)) {
        return `${value} does not match ${rules.regex}`;
      }
    }
    if (rules.max) {
      if (value.length > rules.max) {
        return `must be less than ${rules.max} characters`;
      }
    }
    if (rules.min) {
      if (value.length < rules.min) {
        return `must be at least ${rules.min} characters`;
      }
    }
    if (rules.required && value.length === 0) {
      return `required`;
    }
  }
  return "";
}

export function validateNumber(value: number, rules?: Rules): string {
  if (rules) {
    if (rules.max) {
      if (value > rules.max) {
        return `must be less than ${rules.max}`;
      }
    }
    if (rules.min) {
      if (value < rules.min) {
        return `must be at least ${rules.min}`;
      }
    }
    if (rules.required && value === 0) {
      return `required`;
    }
  }
  return "";
}

export interface DateRules {
  min?: Date;
  max?: Date;
  required?: boolean;
}

export function validateDate(value?: Date, rules?: DateRules): string {
  if (rules && value) {
    if (rules.required && (!value || isNaN(value.getTime()))) {
      return `required`;
    }

    if (rules.max && value > rules.max) {
      return `must be before ${rules.max.toLocaleDateString()}`;
    }

    if (rules.min && value < rules.min) {
      return `must be after ${rules.min.toLocaleDateString()}`;
    }
  }
  return "";
}
