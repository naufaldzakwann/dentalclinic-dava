import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { site } from "@/lib/site";
import { login } from "../actions";

export const metadata: Metadata = {
  title: `Masuk Admin — ${site.name}`,
  robots: { index: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAdmin()) redirect("/admin");
  const { error } = await searchParams;

  return (
    <main className="grid min-h-dvh place-items-center bg-cream px-5">
      <div className="w-full max-w-sm rounded-[1.75rem] bg-white p-8 shadow-lift">
        <span className="mb-6 grid h-12 w-12 place-items-center rounded-2xl bg-brand-600 text-white shadow-card">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="4" y="11" width="16" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
        </span>
        <h1 className="text-xl font-bold text-ink">Dashboard Admin</h1>
        <p className="mt-1 text-sm text-ink-soft">Khusus staf klinik. Masukkan password admin.</p>

        <form action={login} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink">Password</span>
            <input
              type="password"
              name="password"
              required
              autoFocus
              className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-brand-500"
              placeholder="••••••••"
            />
          </label>
          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-200">
              Password salah. Coba lagi.
            </p>
          )}
          <button
            type="submit"
            className="w-full rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-brand-700"
          >
            Masuk
          </button>
        </form>
      </div>
    </main>
  );
}
