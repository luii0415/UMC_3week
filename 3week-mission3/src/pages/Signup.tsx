// pages/Signup.tsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useLocalStorage from "../hooks/useLocalStorage";

/* ---- Zod Schemas ---- */

const emailSchema = z.object({
  email: z.string().email("올바른 이메일 형식을 입력해주세요."),
});

const passwordSchema = z
  .object({
    password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    path: ["confirm"],
    message: "비밀번호가 일치하지 않습니다.",
  });

const nicknameSchema = z.object({
  nickname: z.string().min(1, "닉네임을 입력해주세요."),
});

/* ---- Step Components ---- */

const StepEmail = ({ onNext }: { onNext: (email: string) => void }) => {
  const { setItem } = useLocalStorage();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>({
    resolver: zodResolver(emailSchema),
  });

  const onSubmit = ({ email }: { email: string }) => {
    setItem("signup-email", email);
    onNext(email);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-sm space-y-4"
    >
      <input
        {...register("email")}
        placeholder="이메일"
        className="w-full rounded-md bg-gray-900 px-4 py-2 text-white"
      />
      {errors.email && (
        <p className="text-sm text-red-500">{errors.email.message}</p>
      )}
      <button
        type="submit"
        className="w-full rounded-md bg-pink-500 py-2 text-white"
      >
        다음
      </button>
    </form>
  );
};

const StepPassword = ({
  email,
  onNext,
}: {
  email: string;
  onNext: (password: string) => void;
}) => {
  const [show, setShow] = useState(false);
  const { getItem } = useLocalStorage();

  useEffect(() => {
    const saved = getItem("signup-email");
    if (saved) console.log("저장된 이메일:", saved);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<{ password: string; confirm: string }>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = () => {
    const { password } = getValues();
    onNext(password);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-sm space-y-4"
    >
      <p className="text-sm text-gray-400 text-center">{email}</p>
      <div className="relative">
        <input
          {...register("password")}
          type={show ? "text" : "password"}
          placeholder="비밀번호"
          className="w-full rounded-md bg-gray-900 px-4 py-2 text-white"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute inset-y-0 right-3"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {errors.password && (
        <p className="text-sm text-red-500">{errors.password.message}</p>
      )}

      <input
        {...register("confirm")}
        type="password"
        placeholder="비밀번호 재확인"
        className="w-full rounded-md bg-gray-900 px-4 py-2 text-white"
      />
      {errors.confirm && (
        <p className="text-sm text-red-500">{errors.confirm.message}</p>
      )}

      <button
        type="submit"
        className="w-full rounded-md bg-pink-500 py-2 text-white"
      >
        다음
      </button>
    </form>
  );
};

const StepNickname = ({
  email,
  onComplete,
}: {
  email: string;
  onComplete: (nickname: string) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ nickname: string }>({
    resolver: zodResolver(nicknameSchema),
  });

  const onSubmit = ({ nickname }: { nickname: string }) => {
    onComplete(nickname);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-sm space-y-4"
    >
      <p className="text-sm text-gray-400 text-center">{email}</p>
      <div className="mx-auto mb-4 h-28 w-28 rounded-full bg-gray-700" />
      <input
        {...register("nickname")}
        placeholder="닉네임"
        className="w-full rounded-md bg-gray-900 px-4 py-2 text-white"
      />
      {errors.nickname && (
        <p className="text-sm text-red-500">{errors.nickname.message}</p>
      )}
      <button
        type="submit"
        className="w-full rounded-md bg-pink-500 py-2 text-white"
      >
        회원가입 완료
      </button>
    </form>
  );
};

/* ---- Signup ---- */

const Signup: React.FC = () => {
  const [step, setStep] = useState<"email" | "password" | "nickname">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { removeItem } = useLocalStorage();

  const handleEmailNext = (email: string) => {
    setEmail(email);
    setStep("password");
  };

  const handlePasswordNext = (password: string) => {
    setPassword(password);
    setStep("nickname");
  };

  const handleComplete = (nickname: string) => {
    console.log({ email, password, nickname });
    alert("회원가입이 완료되었습니다!");
    removeItem("signup-email");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between bg-[#131a24] px-6 py-3">
        <h1 className="text-lg font-bold text-white">회원가입</h1>
        <div className="space-x-2">
          <button
            onClick={() => navigate("/login")}
            className="rounded bg-lpPink px-3 py-1 text-sm text-white"
          >
            로그인
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="rounded bg-gray-800 px-3 py-1 text-sm text-white"
          >
            회원가입
          </button>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center bg-black px-4 text-white">
        <div className="mb-10 text-2xl font-bold">회원가입</div>
        {step === "email" && <StepEmail onNext={handleEmailNext} />}
        {step === "password" && (
          <StepPassword email={email} onNext={handlePasswordNext} />
        )}
        {step === "nickname" && (
          <StepNickname email={email} onComplete={handleComplete} />
        )}
      </main>
    </div>
  );
};

export default Signup;
