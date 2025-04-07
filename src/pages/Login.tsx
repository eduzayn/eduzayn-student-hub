
import React from "react";
import { AuthTabs } from "@/components/auth/AuthTabs";

const Login = () => {
  return (
    <div className="container max-w-md mx-auto py-10">
      <AuthTabs defaultTab="login" />
    </div>
  );
};

export default Login;
