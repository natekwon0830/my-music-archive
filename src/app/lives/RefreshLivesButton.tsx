"use client";

import { useTransition } from "react";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { LiveEntry } from "@/data/music";

export default function RefreshLivesButton({ lives }: { lives: LiveEntry[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isChecking, setIsChecking] = useState(false);
  const [status, setStatus] = useState("");
  const latestLives = useRef(JSON.stringify(lives));

  async function checkForUpdates() {
    setIsChecking(true);
    setStatus("");

    try {
      const response = await fetch("/api/lives", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("라이브 데이터를 가져오지 못했습니다.");
      }

      const updatedLives: LiveEntry[] = await response.json();
      const updatedSnapshot = JSON.stringify(updatedLives);
      const hasChanges = latestLives.current !== updatedSnapshot;
      latestLives.current = updatedSnapshot;
      setStatus(hasChanges ? "변경사항을 반영했습니다." : "새로운 변경사항이 없습니다.");
      startTransition(() => router.refresh());
    } catch {
      setStatus("확인에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={() => void checkForUpdates()}
        disabled={isChecking || isPending}
        className="rounded-full border border-white/20 bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:cursor-wait disabled:opacity-60"
      >
        {isChecking || isPending ? "시트 확인 중…" : "↻ 새로고침"}
      </button>
      <span role="status" aria-live="polite" className="text-xs text-zinc-400">
        {status}
      </span>
    </div>
  );
}
