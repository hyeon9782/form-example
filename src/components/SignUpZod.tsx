import { z } from "zod";
import { useForm } from "react-hook-form";
import { signUp } from "../api/auth";
import { zodResolver } from "@hookform/resolvers/zod";

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,9}$/;

const User = z.object({
  email: z
    .string()
    .email("유효한 이메일 주소를 입력해야 합니다.")
    .min(1, "이메일은 필수입니다."),
  password: z
    .string()
    .min(1, "비밀번호는 필수입니다.")
    .regex(
      PASSWORD_REGEX,
      "비밀번호는 영어 + 숫자 최소 각각 한글자 이상, 6글자 이상 9글자 이하 입니다."
    ),
});

type User = z.infer<typeof User>;

const SignUpZod = () => {
  const { register, handleSubmit, formState } = useForm<User>({
    mode: "onChange",
    resolver: zodResolver(User),
  });

  const { errors, isValid } = formState;
  const { email, password } = errors;

  const onSubmit = handleSubmit(async (data: User) => {
    await signUp(data);
  });

  return (
    <form onSubmit={onSubmit}>
      <input placeholder="이메일" {...register("email")} />
      {email && <span role="alert">{errors.email?.message}</span>}
      <input placeholder="비밀번호" type="password" {...register("password")} />
      {password && <span role="alert">{errors.password?.message}</span>}
      <button disabled={!isValid} type="submit">
        회원가입
      </button>
    </form>
  );
};

export default SignUpZod;
