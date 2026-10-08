export default function AdminReviewsPage() {
  return (
    <>
      <div>
        <h1 className="text-[clamp(1.75rem,3vw,2.25rem)] font-semibold tracking-[-0.02em]">
          Reviews
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          Submissions go to data/reviews-pending.json until approved. For a full
          CRUD flow, connect MongoDB to approve, reject and publish here.
        </p>
      </div>

      <div className="rounded-card bg-white p-6 text-[15px] text-muted">
        Pending reviews are stored locally for now. Connect MongoDB and extend
        this page to approve items from the Review model.
      </div>
    </>
  );
}
