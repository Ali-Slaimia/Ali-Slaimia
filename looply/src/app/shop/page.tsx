"use client";

import { AppShell } from "@/components/AppShell";
import { Pressable } from "@/components/Pressable";
import { SHOP } from "@/lib/constants";
import { canAfford } from "@/lib/game";
import { useGame } from "@/lib/store";
import type { ShopItemId } from "@/lib/types";

const ORDER: ShopItemId[] = ["hearts", "freeze", "double", "shades", "crown"];

export default function ShopPage() {
  const { state, dispatch } = useGame();

  return (
    <AppShell>
      <h1 className="text-3xl font-black">Shop</h1>
      <p className="mb-4 font-semibold text-muted">Spend gems on survival tools and Loopy merch. No real money, ever.</p>
      <div className="grid gap-3">
        {ORDER.map((id) => {
          const item = SHOP[id];
          const affordable = canAfford(state, id);
          return (
            <article key={id} className="flex items-center gap-3 rounded-3xl border-[3px] border-[#14342c] bg-white p-4 shadow-[0_5px_0_#14342c]">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#e8fff8] text-2xl">{item.emoji}</div>
              <div className="flex-1">
                <h2 className="font-black">{item.title}</h2>
                <p className="text-sm font-semibold text-muted">{item.blurb}</p>
              </div>
              <Pressable tone="gold" disabled={!affordable} onClick={() => dispatch({ type: "BUY", item: id })}>
                {item.cost}
              </Pressable>
            </article>
          );
        })}
      </div>
    </AppShell>
  );
}
