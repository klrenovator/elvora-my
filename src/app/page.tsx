export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[#f8f8f5] px-6 text-[#222822] sm:px-12">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between border-b border-[#dde1d9] py-7">
        <span className="text-lg font-semibold tracking-[-0.04em]">elvora<span className="text-[#879783]">.my</span></span>
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-[#758172]">Coming soon</span>
      </header>

      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center py-24">
        <div className="mb-8 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#788a75]">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#99ad93]" />
          A new beginning
        </div>
        <h1 className="max-w-3xl text-5xl font-medium leading-[1.08] tracking-[-0.055em] sm:text-7xl">
          Something good is taking shape.
        </h1>
        <p className="mt-7 max-w-md text-base leading-7 text-[#697368] sm:text-lg">
          Welcome to elvora.my. We&apos;re building something new and look forward to sharing it with you soon.
        </p>
      </section>

      <footer className="mx-auto flex w-full max-w-6xl items-center justify-between border-t border-[#dde1d9] py-7 text-xs text-[#758172]">
        <span>© {new Date().getFullYear()} elvora.my</span>
        <span>Made for what&apos;s next.</span>
      </footer>
    </main>
  );
}
