import { ChangeEvent, useRef, useState } from "react";

type UseFormProps<T extends string[]> = {
  [key in T[number]]: {
    defaultValue?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    validation?: {
      pattern?: {
        message: string;
        value: RegExp;
      };
      required?: {
        message: string;
        value: boolean;
      };
    };
  };
};

type FormState<T extends string[]> =
  | { [key in T[number]]: string | undefined }
  | undefined;

export const useForm = <T extends string[]>(props: UseFormProps<T>) => {
  const ref = useRef<{ [key in T[number]]: HTMLInputElement }>({} as any);

  const [formState, setFormState] = useState<FormState<T>>();

  const isNotYetInSyncRef = Object.keys(ref.current).length === 0;

  const initValue = Object.keys(props).reduce((acc, key) => {
    acc[key as T[number]] = props[key as T[number]].defaultValue ?? "";
    if (!acc) return acc;
    return acc;
  }, {} as { [key in T[number]]: string });

  const getValues = () => {
    if (isNotYetInSyncRef) return initValue;

    const values = {} as { [key in T[number]]: string };
    Object.keys(ref.current).forEach((_key) => {
      const key = _key as T[number];
      values[key] = ref.current[key].value;
    });

    return values;
  };

  const isAllVaild = Object.keys(getValues()).every((key: T[number]) => {
    const value = getValues()[key];
    const { validation } = props[key];
    const { pattern, required } = validation || {};

    if (required?.value && !value && !pattern?.value) return false;
    if (pattern && !pattern.value.test(value)) return false;

    return true;
  });

  const setFormStateTarget = (name: T[number], message: string) => {
    setFormState((prev) => {
      const newState = !prev
        ? ({ [name]: message } as FormState<T>)
        : { ...prev, [name]: message };

      return newState;
    });
  };

  const register = (name: T[number]) => {
    const setRef = (el: HTMLInputElement) => {
      ref.current[name] = el;
    };

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
      const required = props[name].validation?.required;
      const pattern = props[name].validation?.pattern;
      const customOnChange = props[name].onChange;
      const currentErrorMessage = formState?.[name];
      const { message: requireErrorMessage, value: isRequired } =
        required || {};
      const { message: patternErrorMessage, value: patternRegex } =
        pattern || {};

      const { value } = e.target;
      const isValidPattern = patternRegex?.test(value);

      customOnChange?.(e);

      // pattern 밸리데이션 처리
      if (
        currentErrorMessage !== patternErrorMessage &&
        patternRegex &&
        !isValidPattern
      ) {
        setFormStateTarget(name, patternErrorMessage ?? "");

        // required 밸리데이션 처리
      } else if (isRequired && value === "") {
        setFormStateTarget(name, requireErrorMessage ?? "");

        // 밸리데이션 통과
      } else if (
        (patternRegex &&
          currentErrorMessage === patternErrorMessage &&
          (isValidPattern || !value)) ||
        (isRequired &&
          currentErrorMessage === requireErrorMessage &&
          value !== "")
      ) {
        setFormStateTarget(name, "");
      }
    };

    return {
      defaultValue: props[name].defaultValue,
      onChange,
      ref: setRef,
    };
  };

  return { formState, getValues, isAllVaild, register };
};
