import { getProductReviews } from "../lib/reviews";

interface ReviewsSectionProps {
  productName: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={
            star <= rating
              ? "text-yellow-400 text-lg"
              : "text-muted-foreground/30 text-lg"
          }
        >
          {star <= rating ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}

export default function ReviewsSection({ productName }: ReviewsSectionProps) {
  const reviews = getProductReviews(productName);
  const avgRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const roundedAvg = Math.round(avgRating * 10) / 10;

  return (
    <section className="mt-12" data-ocid="reviews.section">
      <div className="border-t border-border pt-8">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            Customer Reviews
          </h2>
          <div className="flex items-center gap-2 bg-muted/60 px-3 py-1.5 rounded-full">
            <span className="text-yellow-400 text-lg">★</span>
            <span className="font-bold text-foreground">{roundedAvg}</span>
            <span className="text-muted-foreground text-sm">
              / 5 &middot; {reviews.length} reviews
            </span>
          </div>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          data-ocid="reviews.list"
        >
          {reviews.map((review, idx) => (
            <div
              key={review.id}
              className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3 hover:border-primary/30 hover:shadow-md transition-all"
              data-ocid={`reviews.item.${idx + 1}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-foreground">{review.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {review.date}
                  </p>
                </div>
                <StarRating rating={review.rating} />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
