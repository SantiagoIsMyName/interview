import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function jsonClone<T>(input: T): T {
  const jsonString = JSON.stringify(input)
  return JSON.parse(jsonString)
}