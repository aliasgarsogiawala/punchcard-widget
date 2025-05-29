"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/punchcard");
    }, 200); 
    return () => clearTimeout(timeout);
  }, [router]);
}
