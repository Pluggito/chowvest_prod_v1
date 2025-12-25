"use client";
import { useState } from "react";
import { AuthContainer } from "@/components/auth-components/auth-container";
import { SignIn } from "@/components/auth-components/sign-in";
import { SignUp } from "@/components/auth-components/sign-up";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <AuthContainer>
      {isSignUp ? (
        <SignUp onToggle={() => setIsSignUp(false)} />
      ) : (
        <SignIn onToggle={() => setIsSignUp(true)} />
      )}
    </AuthContainer>
  );
}
