"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

//the form only gets the username for now. This is using ShadCN, a library
const formSchema = z.object({
  username: z.string().min(2).max(50),
});

type FormType = "sign-in" | "sign-up";

const AuthForm = ({ type }: { type: FormType }) => {
  // 1. Define your form. Uses "userForm" from the reactForm library. Being of type schema, takes a username
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  };

  return (
    //returns with only one single formField
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
          <h1 className="form-title">
            {type === "sign-in" ? "Sign In" : "Sign Up"}
          </h1>
          {type === "sign-up" && (
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      {/*here will be a OTP verification*/}
    </>
    //because this will have an OTP verification, we need to evelope the form with a "react fragment (<>)"
  );
};

export default AuthForm;
