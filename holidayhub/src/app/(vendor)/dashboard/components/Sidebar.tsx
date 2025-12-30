interface SidebarProps {
  selected: string;
  setSelected: (val: string) => void;
}

export default function Sidebar({ selected, setSelected }: SidebarProps) {
  const options = ["packages", "orders", "payments", "settings"];

  return (
    <aside className="w-1/4 border-r p-4">
      <ul className="space-y-2">
        {options.map((opt) => (
          <li
            key={opt}
            className={`cursor-pointer p-2 rounded ${
              selected === opt ? "bg-green-200" : ""
            }`}
            onClick={() => setSelected(opt)}
          >
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </li>
        ))}
      </ul>
    </aside>
  );
}
