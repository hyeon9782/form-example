import { FormEvent } from "react";
import { useForm } from "react-hook-form";
import { signUp } from "../api/auth";

const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,9}$/;

const ERROR_MESSAGE = {
  email: {
    required: "이메일은 필수 입력입니다.",
    invalid: "이메일 양식이 아닙니다.",
  },
  password: {
    required: "비밀번호는 필수 입력입니다.",
    invalid:
      "비밀번호는 영어 + 숫자 최소 각각 한글자 이상, 6글자 이상 9글자 이하 입니다.",
  },
};

const SignUpHook = () => {
  const { register, formState, getValues, isAllVaild } = useForm<
    ["email", "password"]
  >({
    email: {
      validation: {
        required: {
          message: ERROR_MESSAGE.email.required,
          value: true,
        },
        pattern: {
          message: ERROR_MESSAGE.email.invalid,
          value: EMAIL_REGEX,
        },
      },
    },
    password: {
      validation: {
        required: {
          message: ERROR_MESSAGE.password.required,
          value: true,
        },
        pattern: {
          message: ERROR_MESSAGE.password.invalid,
          value: PASSWORD_REGEX,
        },
      },
    },
  });

  const { email: emailErrorMessage, password: passwordErrorMessage } =
    formState || {};

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = getValues();
    await signUp({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="이메일" {...register("email")} />
      {!!emailErrorMessage && <span role="alert">{emailErrorMessage}</span>}
      <input placeholder="비밀번호" type="password" {...register("password")} />
      {!!passwordErrorMessage && (
        <span role="alert">{passwordErrorMessage}</span>
      )}
      <button disabled={!isAllVaild} type="submit">
        회원가입
      </button>
    </form>
  );
};

export default SignUpHook;
