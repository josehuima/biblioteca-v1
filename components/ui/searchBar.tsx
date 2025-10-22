"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

type Props = {
  onSearch: (query: string) => void;
};

export default function SearchBar({ onSearch }: Props) {
  const [input, setInput] = useState("");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      onSearch(input.trim());
    }, 300); // debounce for 300ms

    return () => clearTimeout(delayDebounce);
  }, [input]);

  return (
    <div className="flex items-center space-x-2">
      <Input
        type="text"
        className="px-3 py-2 w-80"
        placeholder="Procurar por livros, monografias..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
    </div>
  );
}
