"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { LoginSchema } from "@/schemas/login";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { login } from "@/lib/actions";
import { useState, useTransition } from "react";
import CardWrapper from "@/components/auth/card-wrapper";
import AlertCard from "@/components/alert-card";

const LoginForm = () => {
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof LoginSchema>) {
    setError("");
    startTransition(() => {
      login(values).then((data) => {
        if (data?.error) {
          setError(data.error);
        }
      });
    });
  }

  return (
    <CardWrapper
      linkHref="/register"
      linkLabel="Don't have an account?"
      title="Log In"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    type="email"
                    placeholder="johndoe@example.com"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    type="password"
                    placeholder="******"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isPending} className="w-full mt-2" type="submit">
            Log in
          </Button>
          {error && <AlertCard type="error">{error}</AlertCard>}
        </form>
      </Form>
    </CardWrapper>
  );
};

export default LoginForm;
