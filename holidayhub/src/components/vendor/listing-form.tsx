"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash2,
  Loader2,
  CheckCircle2,
  MapPin,
  CalendarDays,
  Image as ImageIcon,
  ListChecks,
  Sparkles,
  Info,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getBrowserClient } from "@/lib/supabase/client";
import type { ListingKind } from "@/lib/supabase/listing";

type ItineraryRow = { time: string; title: string; description: string };
type FaqRow = { question: string; answer: string };
type BatchRow = { departAt: string; returnAt: string; totalSlots: string; priceOverride: string };

const VERTICALS = [
  { value: "wellness", label: "Wellness" },
  { value: "adrenaline", label: "Adrenaline" },
  { value: "solo_explorer", label: "Solo Explorer" },
  { value: "crew", label: "Crew" },
];
const DIFFICULTIES = [
  { value: "easy", label: "Easy" },
  { value: "moderate", label: "Moderate" },
  { value: "hard", label: "Hard" },
];
const QUICK_TAGS = [
  "Uttarakhand", "Goa", "Kerala", "Rajasthan", "Himachal", "Beach",
  "Trek", "Adventure", "Weekend", "Solo", "Group", "Luxury",
];

const linesToArray = (s: string) =>
  s.split("\n").map((x) => x.trim()).filter(Boolean);
const csvToArray = (s: string) =>
  s.split(",").map((x) => x.trim()).filter(Boolean);

export function ListingForm({
  vendorId,
  defaultType = "package",
  initialId,
}: {
  vendorId: string;
  defaultType?: ListingKind;
  initialId?: string;
}) {
  const router = useRouter();
  const [type, setType] = useState<ListingKind>(defaultType);
  const [status, setStatus] = useState<"draft" | "published">("published");
  const [loadingInitial, setLoadingInitial] = useState(Boolean(initialId));

  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [vertical, setVertical] = useState("crew");
  const [difficulty, setDifficulty] = useState("easy");

  const [sourceHub, setSourceHub] = useState("");
  const [destination, setDestination] = useState("");
  const [meetingPoint, setMeetingPoint] = useState("");
  const [meetingTime, setMeetingTime] = useState("");

  const [price, setPrice] = useState("");
  const [durationDays, setDurationDays] = useState("2");
  const [durationHours, setDurationHours] = useState("");

  const [coverImage, setCoverImage] = useState("");
  const [gallery, setGallery] = useState("");

  const [tags, setTags] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const [itinerary, setItinerary] = useState<ItineraryRow[]>([
    { time: "", title: "", description: "" },
  ]);
  const [inclusions, setInclusions] = useState("");
  const [exclusions, setExclusions] = useState("");
  const [thingsToCarry, setThingsToCarry] = useState("");

  const [faqs, setFaqs] = useState<FaqRow[]>([]);
  const [cancellation, setCancellation] = useState("");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");

  const [batches, setBatches] = useState<BatchRow[]>([
    { departAt: "", returnAt: "", totalSlots: "10", priceOverride: "" },
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // Prefill when editing an existing listing
  useEffect(() => {
    if (!initialId) return;
    (async () => {
      try {
        const supabase = getBrowserClient();
        const { data: lst } = await supabase
          .from("listings")
          .select("*")
          .eq("id", initialId)
          .single();
        if (!lst) return;
        setType(lst.type);
        setStatus(lst.status);
        setTitle(lst.title ?? "");
        setTagline(lst.summary ?? "");
        setDescription(lst.description ?? "");
        setVertical(lst.vertical ?? "crew");
        setDifficulty(lst.difficulty ?? "easy");
        setSourceHub(lst.source_hub ?? "");
        setDestination(lst.destination ?? "");
        setMeetingPoint(lst.meeting_point ?? "");
        setMeetingTime(lst.meeting_time ?? "");
        setPrice(String(lst.price ?? ""));
        setDurationDays(lst.duration_days != null ? String(lst.duration_days) : "2");
        setDurationHours(lst.duration_hours != null ? String(lst.duration_hours) : "");
        setCoverImage(lst.cover_image ?? "");
        setGallery((lst.gallery ?? []).join(", "));
        setActiveTags(lst.tags ?? []);
        setItinerary(
          (lst.itinerary ?? []).length
            ? (lst.itinerary as ItineraryRow[]).map((i) => ({
                time: i.time ?? "",
                title: i.title ?? "",
                description: i.description ?? "",
              }))
            : [{ time: "", title: "", description: "" }]
        );
        setInclusions((lst.inclusions ?? []).join("\n"));
        setExclusions((lst.exclusions ?? []).join("\n"));
        setThingsToCarry((lst.things_to_carry ?? []).join("\n"));
        setFaqs(
          (lst.faqs ?? []).length
            ? (lst.faqs as FaqRow[])
            : []
        );
        setCancellation(lst.cancellation_policy ?? "");
        setMinAge(lst.min_age != null ? String(lst.min_age) : "");
        setMaxAge(lst.max_age != null ? String(lst.max_age) : "");

        const { data: bd } = await supabase
          .from("batch_dates")
          .select("id, depart_at, return_at, batch_slots(total_slots, price_override)")
          .eq("listing_id", initialId)
          .order("depart_at", { ascending: true });
        const loaded = (bd ?? []).flatMap((b: any) =>
          (b.batch_slots ?? []).map((s: any) => ({
            departAt: b.depart_at ? b.depart_at.slice(0, 16) : "",
            returnAt: b.return_at ? b.return_at.slice(0, 16) : "",
            totalSlots: String(s.total_slots ?? 0),
            priceOverride: s.price_override != null ? String(s.price_override) : "",
          }))
        );
        if (loaded.length) setBatches(loaded);
      } catch {
        /* ignore */
      } finally {
        setLoadingInitial(false);
      }
    })();
  }, [initialId]);

  const toggleTag = (t: string) =>
    setActiveTags((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );

  const slugify = (s: string) =>
    s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      if (!title.trim()) throw new Error("Title is required.");
      if (!destination.trim()) throw new Error("Destination is required.");
      if (!sourceHub.trim()) throw new Error("Source hub (origin city) is required.");
      if (!price || Number(price) <= 0) throw new Error("Enter a valid price.");

      const supabase = getBrowserClient();
      const payload = {
        type,
        title: title.trim(),
        summary: tagline.trim() || null,
        description: description.trim() || null,
        vertical,
        difficulty,
        source_hub: sourceHub.trim(),
        destination: destination.trim(),
        meeting_point: meetingPoint.trim() || null,
        meeting_time: meetingTime.trim() || null,
        price: Number(price),
        currency: "INR",
        duration_days: durationDays ? Number(durationDays) : null,
        duration_hours: durationHours ? Number(durationHours) : null,
        cover_image: coverImage.trim() || null,
        gallery: csvToArray(gallery),
        tags: [...new Set([...csvToArray(tags), ...activeTags])],
        itinerary: itinerary
          .filter((i) => i.title.trim())
          .map((i) => ({ time: i.time || null, title: i.title, description: i.description || null })),
        inclusions: linesToArray(inclusions),
        exclusions: linesToArray(exclusions),
        things_to_carry: linesToArray(thingsToCarry),
        faqs: faqs
          .filter((f) => f.question.trim())
          .map((f) => ({ question: f.question, answer: f.answer })),
        cancellation_policy: cancellation.trim() || null,
        min_age: minAge ? Number(minAge) : null,
        max_age: maxAge ? Number(maxAge) : null,
        status,
      };

      let listingId = initialId;
      if (initialId) {
        const { error: le } = await supabase.from("listings").update(payload).eq("id", initialId);
        if (le) throw new Error(le.message);
      } else {
        const slug = `${slugify(title)}-${Date.now().toString(36)}`;
        const { data: listing, error: le } = await supabase
          .from("listings")
          .insert({ ...payload, vendor_id: vendorId, slug })
          .select("id")
          .single();
        if (le) throw new Error(le.message);
        listingId = listing.id;
      }

      // Reconcile batches: drop existing, recreate from form
      if (listingId) {
        const { data: existing } = await supabase
          .from("batch_dates")
          .select("id")
          .eq("listing_id", listingId);
        if (existing?.length) {
          await supabase.from("batch_dates").delete().eq("listing_id", listingId);
        }
        const validBatches = batches.filter((b) => b.departAt && b.returnAt && Number(b.totalSlots) > 0);
        for (const b of validBatches) {
          const { data: bd, error: bde } = await supabase
            .from("batch_dates")
            .insert({
              listing_id: listingId,
              listing_type: type,
              depart_at: new Date(b.departAt).toISOString(),
              return_at: new Date(b.returnAt).toISOString(),
              status: "open",
            })
            .select("id")
            .single();
          if (bde) throw new Error(bde.message);
          const { error: se } = await supabase.from("batch_slots").insert({
            batch_date_id: bd.id,
            total_slots: Number(b.totalSlots),
            booked_slots: 0,
            price_override: b.priceOverride ? Number(b.priceOverride) : null,
          });
          if (se) throw new Error(se.message);
        }
      }

      setDone(true);
      setTimeout(() => router.push("/vendor/listings/" + (type === "package" ? "packages" : "activities")), 1200);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingInitial) {
    return <div className="py-20 text-center text-gray-400">Loading listing…</div>;
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          {initialId ? "Listing updated" : "Listing created"}
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Redirecting to your {type === "package" ? "packages" : "activities"}…
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {initialId ? "Edit listing" : "Create a new listing"}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              One form for both packages and activities — just pick the type.
            </p>
          </div>
        {/* Type toggle */}
        <div className="inline-flex rounded-xl border border-gray-300 p-1">
          {(["package", "activity"] as ListingKind[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`rounded-lg px-5 py-2 text-sm font-medium capitalize transition-colors ${
                type === t ? "bg-primary-600 text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Basics */}
      <Card className="p-6">
        <SectionTitle icon={Sparkles} title="Basics" />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Title" required>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Goa Beach Paradise" />
          </Field>
          <Field label="Tagline / summary">
            <Input value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="A chill 4-day beach escape" />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Description">
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Describe the experience, what makes it special…"
              />
            </Field>
          </div>
          <Field label="Vibe / vertical">
            <Select value={vertical} onValueChange={setVertical}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {VERTICALS.map((v) => (
                  <SelectItem key={v.value} value={v.value}>{v.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Difficulty">
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {DIFFICULTIES.map((d) => (
                  <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
      </Card>

      {/* Location & logistics */}
      <Card className="p-6">
        <SectionTitle icon={MapPin} title="Location & logistics" />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Source hub (origin city)" required>
            <Input value={sourceHub} onChange={(e) => setSourceHub(e.target.value)} placeholder="Bangalore" />
          </Field>
          <Field label="Destination" required>
            <Input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Goa" />
          </Field>
          <Field label="Meeting point">
            <Input value={meetingPoint} onChange={(e) => setMeetingPoint(e.target.value)} placeholder="Indiranagar bus stop" />
          </Field>
          <Field label="Meeting time">
            <Input value={meetingTime} onChange={(e) => setMeetingTime(e.target.value)} placeholder="Friday 8:00 PM" />
          </Field>
        </div>
      </Card>

      {/* Pricing & duration */}
      <Card className="p-6">
        <SectionTitle icon={Info} title="Pricing & duration" />
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Price (₹)" required>
            <Input type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} placeholder="9999" />
          </Field>
          <Field label="Duration (days)">
            <Input type="number" min={1} value={durationDays} onChange={(e) => setDurationDays(e.target.value)} placeholder="2" />
          </Field>
          <Field label="Duration (hours, optional)">
            <Input type="number" min={0} value={durationHours} onChange={(e) => setDurationHours(e.target.value)} placeholder="48" />
          </Field>
        </div>
      </Card>

      {/* Media */}
      <Card className="p-6">
        <SectionTitle icon={ImageIcon} title="Media" />
        <div className="grid gap-5 sm:grid-cols-1">
          <Field label="Cover image URL">
            <Input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://…" />
          </Field>
          <Field label="Gallery URLs (comma separated)">
            <Textarea value={gallery} onChange={(e) => setGallery(e.target.value)} rows={2} placeholder="https://img1.jpg, https://img2.jpg" />
          </Field>
        </div>
      </Card>

      {/* Tags */}
      <Card className="p-6">
        <SectionTitle icon={ListChecks} title="Tags & filters" />
        <Field label="Tags (comma separated)">
          <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Beach, Weekend, Group" />
        </Field>
        <p className="mt-3 text-sm font-medium text-gray-600">Quick picks</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {QUICK_TAGS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => toggleTag(t)}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                activeTags.includes(t)
                  ? "border-primary-600 bg-primary-600 text-white"
                  : "border-gray-300 text-gray-600 hover:border-primary-400"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        {activeTags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {activeTags.map((t) => (
              <Badge key={t} variant="vibe">{t}</Badge>
            ))}
          </div>
        )}
      </Card>

      {/* Itinerary */}
      <Card className="p-6">
        <SectionTitle icon={CalendarDays} title={type === "activity" ? "Schedule" : "Itinerary"} />
        <div className="space-y-4">
          {itinerary.map((row, i) => (
            <div key={i} className="rounded-xl border border-gray-200 p-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <Input
                  placeholder={type === "activity" ? "e.g. 9:00 AM" : "e.g. Day 1 / Friday 8 PM"}
                  value={row.time}
                  onChange={(e) => setItinerary((p) => p.map((r, idx) => idx === i ? { ...r, time: e.target.value } : r))}
                />
                <Input
                  placeholder="Title (e.g. Pickup)"
                  value={row.title}
                  onChange={(e) => setItinerary((p) => p.map((r, idx) => idx === i ? { ...r, title: e.target.value } : r))}
                />
                <div className="flex gap-2">
                  <Input
                    placeholder="Description"
                    value={row.description}
                    onChange={(e) => setItinerary((p) => p.map((r, idx) => idx === i ? { ...r, description: e.target.value } : r))}
                  />
                  <button
                    type="button"
                    onClick={() => setItinerary((p) => p.filter((_, idx) => idx !== i))}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={() => setItinerary((p) => [...p, { time: "", title: "", description: "" }])}>
            <Plus size={16} className="mr-2" /> Add stop
          </Button>
        </div>
      </Card>

      {/* Inclusions / Exclusions / Things to carry */}
      <Card className="p-6">
        <SectionTitle icon={ListChecks} title="Inclusions, exclusions & things to carry" />
        <p className="mb-4 text-xs text-gray-400">One item per line.</p>
        <div className="grid gap-5 md:grid-cols-3">
          <Field label="Inclusions">
            <Textarea value={inclusions} onChange={(e) => setInclusions(e.target.value)} rows={5} placeholder={"Stay\nBreakfast\nTransport"} />
          </Field>
          <Field label="Exclusions">
            <Textarea value={exclusions} onChange={(e) => setExclusions(e.target.value)} rows={5} placeholder={"Flights\nInsurance"} />
          </Field>
          <Field label="Things to carry">
            <Textarea value={thingsToCarry} onChange={(e) => setThingsToCarry(e.target.value)} rows={5} placeholder={"ID proof\nComfortable shoes"} />
          </Field>
        </div>
      </Card>

      {/* FAQs */}
      <Card className="p-6">
        <SectionTitle icon={Info} title="FAQs (optional)" />
        <div className="space-y-4">
          {faqs.map((row, i) => (
            <div key={i} className="rounded-xl border border-gray-200 p-4">
              <div className="grid gap-3">
                <Input
                  placeholder="Question"
                  value={row.question}
                  onChange={(e) => setFaqs((p) => p.map((r, idx) => idx === i ? { ...r, question: e.target.value } : r))}
                />
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Answer"
                    rows={2}
                    value={row.answer}
                    onChange={(e) => setFaqs((p) => p.map((r, idx) => idx === i ? { ...r, answer: e.target.value } : r))}
                  />
                  <button
                    type="button"
                    onClick={() => setFaqs((p) => p.filter((_, idx) => idx !== i))}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={() => setFaqs((p) => [...p, { question: "", answer: "" }])}>
            <Plus size={16} className="mr-2" /> Add FAQ
          </Button>
        </div>
      </Card>

      {/* Policies & age */}
      <Card className="p-6">
        <SectionTitle icon={Info} title="Policy & age" />
        <div className="grid gap-5 sm:grid-cols-3">
          <div className="sm:col-span-3">
            <Field label="Cancellation policy">
              <Textarea value={cancellation} onChange={(e) => setCancellation(e.target.value)} rows={2} placeholder="Free cancellation up to 7 days before…" />
            </Field>
          </div>
          <Field label="Min age">
            <Input type="number" min={0} value={minAge} onChange={(e) => setMinAge(e.target.value)} placeholder="16" />
          </Field>
          <Field label="Max age">
            <Input type="number" min={0} value={maxAge} onChange={(e) => setMaxAge(e.target.value)} placeholder="60" />
          </Field>
        </div>
      </Card>

      {/* Batches — the moat */}
      <Card className="p-6">
        <SectionTitle icon={CalendarDays} title="Batch dates & slots" />
        <p className="mb-4 text-sm text-gray-500">
          Each batch is a departure instance. Slots are held per batch for the weekend-moat inventory.
        </p>
        <div className="space-y-4">
          {batches.map((b, i) => (
            <div key={i} className="rounded-xl border border-gray-200 p-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <div>
                  <Label className="mb-1 block text-xs">Depart</Label>
                  <Input type="datetime-local" value={b.departAt} onChange={(e) => setBatches((p) => p.map((r, idx) => idx === i ? { ...r, departAt: e.target.value } : r))} />
                </div>
                <div>
                  <Label className="mb-1 block text-xs">Return</Label>
                  <Input type="datetime-local" value={b.returnAt} onChange={(e) => setBatches((p) => p.map((r, idx) => idx === i ? { ...r, returnAt: e.target.value } : r))} />
                </div>
                <div>
                  <Label className="mb-1 block text-xs">Total slots</Label>
                  <Input type="number" min={1} value={b.totalSlots} onChange={(e) => setBatches((p) => p.map((r, idx) => idx === i ? { ...r, totalSlots: e.target.value } : r))} />
                </div>
                <div>
                  <Label className="mb-1 block text-xs">Price override (₹)</Label>
                  <Input type="number" min={0} value={b.priceOverride} onChange={(e) => setBatches((p) => p.map((r, idx) => idx === i ? { ...r, priceOverride: e.target.value } : r))} placeholder="optional" />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => setBatches((p) => p.filter((_, idx) => idx !== i))}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={() => setBatches((p) => [...p, { departAt: "", returnAt: "", totalSlots: "10", priceOverride: "" }])}>
            <Plus size={16} className="mr-2" /> Add batch
          </Button>
        </div>
      </Card>

      {/* Submit */}
      <Card className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Label className="mb-1 block text-sm">Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as "draft" | "published")}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-3">
          {error && <span className="text-sm text-red-600">{error}</span>}
          <Button onClick={submit} disabled={submitting} size="lg">
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitting ? "Saving…" : initialId ? "Save changes" : status === "published" ? "Publish listing" : "Save draft"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

function SectionTitle({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="mb-5 flex items-center gap-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
        <Icon className="h-5 w-5" />
      </div>
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1.5 block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      {children}
    </div>
  );
}
