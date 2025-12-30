interface ContentAreaProps {
  selected: string;
}

export default function ContentArea({ selected }: ContentAreaProps) {
  return (
    <section className="w-3/4 p-4">
      {selected === "bookings" && <p>Your bookings will appear here.</p>}
      {selected === "wishlist" && <p>Your wishlist items will appear here.</p>}
      {selected === "cart" && <p>Your cart items will appear here.</p>}
      {selected === "checkout" && <p>Checkout process will appear here.</p>}
      {selected === "settings" && <p>Profile settings will appear here.</p>}
    </section>
  );
}
