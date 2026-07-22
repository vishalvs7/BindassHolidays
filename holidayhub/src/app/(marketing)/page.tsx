import dynamic from 'next/dynamic';
import { HeroBanner } from '@/components/home/hero-banner';
import { CityCards } from '@/components/home/city-cards';

// Lazy-load below-fold sections
const WhyChooseUs = dynamic(() => import('@/components/home/why-choose-us').then((m) => ({ default: m.WhyChooseUs })), {
  loading: () => <div className="h-56 animate-pulse rounded-3xl bg-gray-100 mx-4 my-16" />,
});

const BrowseTabs = dynamic(() => import('@/components/home/browse-tabs').then((m) => ({ default: m.BrowseTabs })), {
  loading: () => <div className="h-48 animate-pulse rounded-3xl bg-gray-100 mx-4 my-16" />,
});

const TrendingSection = dynamic(() => import('@/components/home/trending-section').then((m) => ({ default: m.TrendingSection })), {
  loading: () => <div className="h-80 animate-pulse rounded-3xl bg-gray-100 mx-4 my-16" />,
});

const HotDeals = dynamic(() => import('@/components/home/hot-deals').then((m) => ({ default: m.HotDeals })), {
  loading: () => <div className="h-52 animate-pulse rounded-3xl bg-gray-100 mx-4 my-16" />,
});

const Testimonial = dynamic(() => import('@/components/home/testimonial').then((m) => ({ default: m.Testimonial })), {
  loading: () => <div className="h-64 animate-pulse rounded-3xl bg-gray-100 mx-4 my-16" />,
});

const VendorCTA = dynamic(() => import('@/components/home/vendor-cta').then((m) => ({ default: m.VendorCTA })), {
  loading: () => <div className="h-80 animate-pulse rounded-3xl bg-gray-100 mx-4 my-16" />,
});

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroBanner />
      <CityCards />
      <TrendingSection />
      <WhyChooseUs />
      <BrowseTabs />
      <HotDeals />
      <Testimonial />
      <VendorCTA />
    </div>
  );
}
