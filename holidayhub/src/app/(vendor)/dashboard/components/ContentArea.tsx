interface ContentAreaProps {
  selected: string;
}

export default function ContentArea({ selected }: ContentAreaProps) {
  return (
    <section className="w-3/4 p-4">
      {selected === "packages" && <p>Manage your packages here.</p>}
      {selected === "orders" && <p>View and manage orders here.</p>}
      {selected === "payments" && <p>Payment options and history here.</p>}
      {selected === "settings" && <p>Vendor settings here.</p>}
    </section>
  );
}
