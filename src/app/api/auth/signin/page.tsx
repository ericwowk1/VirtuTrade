"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isSignUp) {
        // Register new user
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        });

        if (response.ok) {
          // After successful registration, sign in
          const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
          });

          if (result?.ok && !result?.error) {
            router.push("/");
          } else {
            setError("Registration successful but sign-in failed. Please try signing in manually.");
          }
        } else {
          const data = await response.json();
          setError(data.message || "Registration failed");
        }
      } else {
        // Sign in existing user
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.ok && !result?.error) {
          router.push("/");
        } else {
          setError("Invalid credentials");
        }
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col lg:flex-row">
      {/* Left side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 min-h-screen lg:min-h-0">
        <div className="w-full max-w-sm sm:max-w-md">
          {/* Logo and Header */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Get Started</h2>
          </div>

          {/* Google Sign Up Button */}
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-2 sm:gap-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-all duration-200 mb-4 sm:mb-6 text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {isSignUp ? "Sign up with Google" : "Sign in with Google"}
          </button>

          {/* Divider */}
          <div className="relative mb-4 sm:mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-600" />
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="px-2 sm:px-3 bg-slate-900 text-slate-400">Or</span>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-red-900/50 border border-red-500/50 text-red-300 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Credentials Form */}
          <form onSubmit={handleCredentialsSubmit} className="space-y-3 sm:space-y-4">
            {isSignUp && (
              <div>
                <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-slate-200 mb-1.5 sm:mb-2">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isSignUp}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  placeholder="Enter your full name"
                />
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-slate-200 mb-1.5 sm:mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-slate-200 mb-1.5 sm:mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                placeholder="Enter your password"
              />
            </div>
            
            <p className="text-slate-400 text-sm sm:text-base">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError("");
                }}
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                {isSignUp ? "Log in" : "Sign up"}
              </button>
            </p>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {loading ? "Loading..." : (isSignUp ? "Sign Up" : "Sign In")}
            </button>
          </form>
        </div>
      </div>

      {/* Right side - Hero Content */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8 xl:p-12 bg-gradient-to-br from-slate-800 to-slate-700">
        <div className="text-center max-w-xl">
          <h2 className="text-3xl xl:text-4xl font-bold text-white mb-4">
            Trading Platform for the{" "}
            <span className="text-blue-400">people</span>.
          </h2>
          <p className="text-slate-300 text-base xl:text-lg leading-relaxed mb-6 xl:mb-8">
            A free and ad free trading platform that's fast, easy to use and comprehensive enough to 
            integrate into your daily routine.
          </p>
          
          {/* Mock Dashboard Preview */}
          <div className="relative">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl xl:rounded-2xl shadow-2xl overflow-hidden border border-slate-600/50">
              <img 
                src="/stockpageview.JPG" 
                alt="Trading dashboard preview" 
                className="w-full h-auto object-cover"
              />
              {/* Optional: Add a subtle overlay for better integration */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent pointer-events-none"></div>
            </div>
            
            {/* Optional: Add some decorative elements */}
            <div className="absolute -top-2 -right-2 w-3 h-3 xl:w-4 xl:h-4 bg-blue-500 rounded-full blur-sm opacity-60"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 xl:w-6 xl:h-6 bg-blue-400 rounded-full blur-md opacity-40"></div>
          </div>
        </div>
      </div>

      {/* Mobile Hero Section - Shows below form on mobile */}
      <div className="lg:hidden w-full p-4 sm:p-6 bg-gradient-to-br from-slate-800 to-slate-700">
        <div className="text-center max-w-md mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
            Trading Platform for the{" "}
            <span className="text-blue-400">people</span>.
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6">
            A free and ad free trading platform that's fast, easy to use and comprehensive enough to 
            integrate into your daily routine.
          </p>
          
          {/* Mock Dashboard Preview for Mobile */}
          <div className="relative">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg sm:rounded-xl shadow-xl overflow-hidden border border-slate-600/50">
              <img 
                src="/stockpageview.jpg" 
                alt="Trading dashboard preview" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent pointer-events-none"></div>
            </div>
            
            <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full blur-sm opacity-60"></div>
            <div className="absolute -bottom-1 -left-1 w-3 h-3 sm:w-4 sm:h-4 bg-blue-400 rounded-full blur-md opacity-40"></div>
          </div>
        </div>
      </div>
    </div>
  );
}