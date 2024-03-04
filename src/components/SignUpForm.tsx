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

interface SignUpForm {
  email: string;
  password: string;
}

const SignUpForm = () => {
  const { register, handleSubmit, formState } = useForm<SignUpForm>({
    mode: "onChange",
  });
  const { errors, isValid } = formState;
  const { email, password } = errors;

  const onSubmit = handleSubmit(async (data: SignUpForm) => {
    await signUp(data);
  });

  return (
    <form onSubmit={onSubmit}>
      <input
        placeholder="이메일"
        {...register("email", {
          pattern: {
            message: ERROR_MESSAGE.email.invalid,
            value: EMAIL_REGEX,
          },
          required: {
            message: ERROR_MESSAGE.email.required,
            value: true,
          },
        })}
      />
      {!!email && <span role="alert">{email.message}</span>}
      <input
        placeholder="비밀번호"
        type="password"
        {...register("password", {
          required: {
            message: ERROR_MESSAGE.password.required,
            value: true,
          },
          pattern: {
            message: ERROR_MESSAGE.password.invalid,
            value: PASSWORD_REGEX,
          },
        })}
      />
      {!!password && <span role="alert">{password.message}</span>}
      <button disabled={!isValid} type="submit">
        회원가입
      </button>
    </form>
  );
};

export default SignUpForm;
