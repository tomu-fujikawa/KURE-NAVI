"use client"
import App from "../components/App";


export default function Home() {
  return (
    <div className="grid  items-center justify-items-center min-h-screen p-8  font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <App />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
