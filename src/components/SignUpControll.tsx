import { useState, FormEvent, ChangeEvent } from "react";
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

const SignUpControll = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const disabledSubmit = !(
    !emailErrorMessage &&
    !passwordErrorMessage &&
    !!email &&
    !!password
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await signUp({ email, password });
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setEmail(value);

    if (value === "") {
      setEmailErrorMessage(ERROR_MESSAGE.email.required);
      return;
    }

    if (!EMAIL_REGEX.test(value)) {
      setEmailErrorMessage(ERROR_MESSAGE.email.invalid);
      return;
    }

    setEmailErrorMessage("");
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setPassword(value);

    if (value === "") {
      setPasswordErrorMessage(ERROR_MESSAGE.password.required);
      return;
    }

    if (!PASSWORD_REGEX.test(value)) {
      setPasswordErrorMessage(ERROR_MESSAGE.password.invalid);
      return;
    }

    setPasswordErrorMessage("");
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="이메일"
        value={email}
        onChange={handleEmailChange}
      />
      {!!emailErrorMessage && <span role="alert">{emailErrorMessage}</span>}
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={handlePasswordChange}
      />
      {!!passwordErrorMessage && (
        <span role="alert">{passwordErrorMessage}</span>
      )}
      <button type="submit">회원가입</button>
    </form>
  );
};

export default SignUpControll;
