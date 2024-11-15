"use client";

import React, { useState, useEffect } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { ILoginCredentials } from "@/interfaces/login.interface";
import { authenticationService } from "@/services/authentication.service";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      className={`flex h-12 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm transition-all duration-300 placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 ${className}`}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800 h-12 px-6 py-2 shadow-lg hover:shadow-xl ${className}`}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={`text-sm font-medium text-gray-700 mb-1 block ${className}`}
      {...props}
    />
  );
});
Label.displayName = "Label";

export default function Component() {
  const [formLogin, setFormLogin] = useState<ILoginCredentials>({
    email: "",
    password: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Validar que los campos no estén vacíos
    const isValid =
      formLogin.email.trim() !== "" && formLogin.password.trim() !== "";
    setIsFormValid(isValid);
  }, [formLogin]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormLogin({
      ...formLogin,
      [name]: value,
    });
  };

  const fetchLogin = async (credentials: ILoginCredentials) => {
    try {
      const response = await authenticationService.login(credentials);
      return response;
    } catch (error) {
      console.error("Error logging in:", (error as Error).message);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      const login = await fetchLogin(formLogin);

      if (login) {
        Cookies.set("token", login.access_token, { expires: 1 });

        router.push("/dashboard");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-96 max-w-md transform transition-all duration-300 hover:shadow-3xl">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Bienvenido
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <div className="relative">
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="tu@ejemplo.com"
                value={formLogin.email}
                onChange={handleChange}
                className="pl-12"
                required
              />
              <Mail
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formLogin.password}
                onChange={handleChange}
                className="pl-12"
                required
              />
              <Lock
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={!isFormValid}>
            Iniciar sesión
            <ArrowRight className="ml-2" size={20} />
          </Button>
        </form>
      </div>
    </div>
  );
}
