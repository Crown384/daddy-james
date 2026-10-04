import { ConvexHttpClient } from "convex/browser";
import { makeFunctionReference } from "convex/server";
import type { BirthdaySubmission, CreateSubmissionInput } from "@/lib/types";

const createSubmission = makeFunctionReference<
  "mutation",
  CreateSubmissionInput,
  string
>("submissions:create");

const listSubmissions = makeFunctionReference<
  "query",
  { token: string },
  BirthdaySubmission[]
>("submissions:list");

function createClient() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL is not configured.");
  }
  return new ConvexHttpClient(url);
}

export async function createBirthdaySubmission(input: CreateSubmissionInput) {
  return createClient().mutation(createSubmission, input);
}

export async function listBirthdaySubmissions(token: string) {
  return createClient().query(listSubmissions, { token });
}
