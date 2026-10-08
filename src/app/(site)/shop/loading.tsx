export default function ShopLoading() {
  return (
    <div className="bg-white" aria-busy="true">
      <section className="section pt-16 md:pt-24">
        <div className="h-[3rem] w-64 animate-pulse rounded-lg bg-line-soft" />
        <div className="mt-4 h-5 max-w-[640px] animate-pulse rounded bg-line-soft" />
      </section>
      <div className="section">
        <div className="h-10 animate-pulse rounded-pill bg-line-soft" />
      </div>
      <section className="section content-auto pb-20 pt-10 md:pb-28">
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-card bg-white">
              <div className="aspect-[4/3] animate-pulse rounded-card bg-line-soft" />
              <div className="mt-5 space-y-2 px-1 text-center">
                <div className="mx-auto h-4 w-3/4 animate-pulse rounded bg-line-soft" />
                <div className="mx-auto h-3 w-1/2 animate-pulse rounded bg-line-soft" />
                <div className="mx-auto h-5 w-1/3 animate-pulse rounded bg-line-soft" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}