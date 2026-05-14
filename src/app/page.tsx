"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
export default function Home() {
  const { data: session } = authClient.useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const onSignUp = () => {
    authClient.signUp.email(
      {
        email,
        name,
        password,
      },
      {
        onError: () => {
          window.alert("Something went wrong with sign up");
        },
        onSuccess: () => {
          window.alert("Sign up successful");
        },
      },
    );
  };

  const onLogin = () => {
    authClient.signIn.email(
      {
        email: loginEmail,
        password: loginPassword,
      },
      {
        onError: () => {
          window.alert("Invalid email or password");
        },
        onSuccess: () => {
          window.alert("Login successful");
        },
      },
    );
  };

  if (session) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-sm border border-gray-100 text-center">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Welcome back!</h1>
            <p className="text-sm text-gray-500">
              Logged in as <span className="font-medium text-gray-900">{session.user.name}</span>
            </p>
          </div>
          <Button 
            onClick={() => authClient.signOut()} 
            variant="outline"
            className="w-full"
          >
            Sign out
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50 space-y-8">
      {/* Sign Up Form */}
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
          <p className="text-sm text-gray-500">Enter your information to get started</p>
        </div>
        <div className="space-y-4">
          <Input
            placeholder="Name"
            value={name}
            onChange={(e: any) => setName(e.target.value)}
            className="w-full"
          />
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
            className="w-full"
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
            className="w-full"
          />
          <Button onClick={onSignUp} className="w-full">
            Create user
          </Button>
        </div>
      </div>

      {/* Login Form */}
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Log in</h1>
          <p className="text-sm text-gray-500">Enter your credentials to access your account</p>
        </div>
        <div className="space-y-4">
          <Input
            placeholder="Email"
            type="email"
            value={loginEmail}
            onChange={(e: any) => setLoginEmail(e.target.value)}
            className="w-full"
          />
          <Input
            placeholder="Password"
            type="password"
            value={loginPassword}
            onChange={(e: any) => setLoginPassword(e.target.value)}
            className="w-full"
          />
          <Button onClick={onLogin} variant="outline" className="w-full">
            Log in
          </Button>
        </div>
      </div>
    </main>
  );
}
