import { useNavigate } from "react-router-dom";
import { FaGoogle, FaArrowLeft } from "react-icons/fa";
import { useForm } from "../hooks/useForm";

interface FormValues {
  email: string;
  password: string;
}

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

/** 입력값 검증 함수 */
const validate = (values: FormValues) => {
  const errors: Partial<Record<keyof FormValues, string>> = {};

  if (!EMAIL_REGEX.test(values.email)) {
    errors.email = "올바른 이메일 형식을 입력해주세요.";
  }

  if (values.password.length < 8) {
    errors.password = "비밀번호는 8자 이상이어야 합니다.";
  }

  return errors;
};

export default function LoginPage() {
  const nav = useNavigate();

  const { values, errors, isSubmitting, handleChange, handleSubmit } =
    useForm<FormValues>({
      initialValues: { email: "", password: "" },
      validate,
      onSubmit: async (data) => {
        const validationErrors = validate(data);
        if (Object.keys(validationErrors).length === 0) {
          alert("로그인 성공!");
          console.log("로그인 데이터:", data);
        }
      },
    });

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between bg-[#131a24] px-6 py-3">
        <h1 className="text-lg font-bold text-white">로그인</h1>
        <div className="space-x-2">
          <button className="rounded bg-gray-800 px-3 py-1 text-sm">
            로그인
          </button>
          <button className="rounded bg-lpPink px-3 py-1 text-sm">
            회원가입
          </button>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center">
        <form
          noValidate
          onSubmit={handleSubmit}
          className="w-[320px] space-y-4 rounded-md bg-transparent"
        >
          <button
            type="button"
            onClick={() => nav(-1)}
            className="mb-2 flex items-center text-sm text-gray-400 hover:text-white"
          >
            <FaArrowLeft className="mr-1" /> 이전
          </button>

          <h2 className="mb-2 text-center text-xl font-semibold">로그인</h2>

          <button
            type="button"
            className="flex w-full items-center justify-center rounded border border-gray-500 py-2 text-sm hover:bg-gray-700"
          >
            <FaGoogle className="mr-2" /> 구글 로그인
          </button>

          <div className="flex items-center">
            <hr className="flex-1 border-gray-600" />
            <span className="mx-2 text-xs text-gray-400">OR</span>
            <hr className="flex-1 border-gray-600" />
          </div>

          <input
            type="email"
            name="email"
            placeholder="이메일을 입력해주세요!"
            value={values.email}
            onChange={handleChange}
            className="w-full rounded border border-gray-600 bg-transparent px-3 py-2 text-sm placeholder-gray-500 focus:border-lpPink focus:outline-none"
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email}</p>
          )}

          <input
            type="password"
            name="password"
            placeholder="비밀번호를 입력해주세요!"
            value={values.password}
            onChange={handleChange}
            className="w-full rounded border border-gray-600 bg-transparent px-3 py-2 text-sm placeholder-gray-500 focus:border-lpPink focus:outline-none"
          />
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full rounded py-2 text-sm text-white bg-black hover:brightness-110`}
          >
            로그인
          </button>
        </form>
      </main>
    </div>
  );
}
