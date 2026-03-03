"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { LoginAction } from "@/src/app/(commonLayout)/(authRouteGroup)/login/_action";
import { ILoginPayload, loginZodSchema } from "@/src/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import AppField from "../../shared/form/AppField";
import { Button } from "../../ui/button";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AppSubmitButton from "../../shared/form/AppSubmitButton";

const LoginForm = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: ILoginPayload) => LoginAction(payload),
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },

    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const result = (await mutateAsync(value)) as any;
        console.log(result);

        if (!result.success) {
          setServerError(result.message || "Login failed");
        }
      } catch (error: any) {
        console.log(`Login failed: ${error.message}`);
        setServerError(`Login failed: ${error.message}`);
      }
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome Back!</CardTitle>
        <CardDescription>
          Please enter your email and password to login.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          method="POST"
          action="#"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="email"
            validators={{ onChange: loginZodSchema.shape.email }}
          >
            {(field) => {
              <AppField
                field={field}
                label="Email"
                type="email"
                placeholder="Enter your email"
              />;
            }}
          </form.Field>

          <form.Field
            name="email"
            validators={{ onChange: loginZodSchema.shape.password }}
          >
            {(field) => {
              <AppField
                field={field}
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                append={
                  <Button
                    onClick={() => setShowPassword(!showPassword)}
                    variant="ghost"
                    size="icon"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </Button>
                }
              />;
            }}
          </form.Field>

          <div className="text-right mt-2">
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline underline-offset-4"
            >
              Forgot Password?
            </Link>
          </div>

          {serverError && (
            <Alert variant={"destructive"}>
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <form.Subscribe
            selector={(s) => [s.canSubmit, s.isSubmitting] as const}
          >
            {([canSubmit, isSubmitting]) => (
              <AppSubmitButton isPending={isSubmitting} disabled={!canSubmit}>
                Log In
              </AppSubmitButton>
            )}
          </form.Subscribe>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          variant={"outline"}
          className="w-full"
          onClick={() => {
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

            window.location.href = `${baseUrl}/auth/login/google`;
          }}
        >
          Sign in with Google
        </Button>
      </CardContent>

      <CardFooter>
        <p className=" text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-primary font-medium hover:underline underline-offset-4"
          >
            Sign Up for an account
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
