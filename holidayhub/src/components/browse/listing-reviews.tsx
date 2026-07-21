"use client";

import { useEffect, useState } from "react";
import { getBrowserClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/hooks/use-auth";
import { Loader2, Star, User } from "lucide-react";

interface Review {
  id: string;
  author_name: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
}

export function ListingReviews({
  listingId,
  listingType,
}: {
  listingId: string;
  listingType: string;
}) {
  const { userData } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [formRating, setFormRating] = useState(0);
  const [formComment, setFormComment] = useState("");
  const [formName, setFormName] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const supabase = getBrowserClient();
        const { data, error: fetchErr } = await supabase
          .from("reviews")
          .select("id, author_name, rating, comment, created_at")
          .eq("listing_id", listingId)
          .eq("listing_type", listingType)
          .order("created_at", { ascending: false });
        if (fetchErr) throw fetchErr;
        setReviews(data ?? []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load reviews.");
      } finally {
        setLoading(false);
      }
    })();
  }, [listingId, listingType]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (formRating < 1 || formRating > 5) return;
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    try {
      const supabase = getBrowserClient();
      const { error: insertErr } = await supabase.from("reviews").insert({
        listing_id: listingId,
        listing_type: listingType,
        user_id: userData?.uid ?? null,
        author_name: (userData?.name ?? formName) || null,
        rating: formRating,
        comment: formComment || null,
      });
      if (insertErr) throw insertErr;

      const optimistic: Review = {
        id: crypto.randomUUID(),
        author_name: (userData?.name ?? formName) || "Anonymous",
        rating: formRating,
        comment: formComment || null,
        created_at: new Date().toISOString(),
      };
      setReviews((prev) => [optimistic, ...prev]);
      setFormRating(0);
      setFormComment("");
      setFormName("");
      setSubmitSuccess(true);
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  }

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <section className="rounded-2xl bg-white p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Reviews</h3>
        {avgRating && (
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <Star size={16} className="fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-gray-900">{avgRating}</span>
            <span>({reviews.length} review{reviews.length > 1 ? "s" : ""})</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10 text-gray-400">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading reviews…
        </div>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : reviews.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center">
          <Star size={32} className="mx-auto text-gray-300" />
          <p className="mt-3 font-semibold text-gray-900">No reviews yet</p>
          <p className="mt-1 text-sm text-gray-500">Be the first to share your experience.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-xl border border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                    <User size={14} />
                  </span>
                  <span className="font-medium text-gray-900">{r.author_name ?? "Anonymous"}</span>
                </div>
                <span className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString("en-IN")}</span>
              </div>
              <div className="mt-2 flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    className={star <= r.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}
                  />
                ))}
              </div>
              {r.comment && <p className="mt-2 text-sm text-gray-700">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}

      <hr className="my-6 border-gray-100" />

      <h4 className="mb-4 font-semibold text-gray-900">Write a Review</h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        {!userData?.name && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Your name</label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Enter your name"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Rating</label>
          <div className="mt-1 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFormRating(star)}
                className="transition-colors"
              >
                <Star
                  size={24}
                  className={star <= formRating ? "fill-yellow-400 text-yellow-400" : "text-gray-200 hover:text-yellow-300"}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Comment</label>
          <textarea
            value={formComment}
            onChange={(e) => setFormComment(e.target.value)}
            placeholder="Share your experience…"
            rows={3}
            maxLength={500}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none"
          />
        </div>

        {submitError && <p className="text-sm text-red-600">{submitError}</p>}
        {submitSuccess && <p className="text-sm text-emerald-600">Review submitted! Thank you.</p>}

        <button
          type="submit"
          disabled={submitting || formRating < 1}
          className="rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
        >
          {submitting ? (
            <span className="flex items-center gap-1.5">
              <Loader2 size={15} className="animate-spin" /> Submitting…
            </span>
          ) : (
            "Submit Review"
          )}
        </button>
      </form>
    </section>
  );
}
