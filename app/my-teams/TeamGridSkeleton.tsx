import { Card } from "@/components/ui/card";

export function TeamGridSkeleton() {
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
      {Array.from({ length: 9 }, (_, index) => (
        <Card
          key={index}
          className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#10131a] p-3"
        >
          <div className="size-11 rounded-md bg-white/10" />
          <div className="flex flex-1 flex-col gap-2">
            <div className="h-5 w-14 rounded-full bg-white/10" />
            <div className="h-4 w-28 rounded bg-white/10" />
          </div>
          <div className="h-9 w-14 rounded-md bg-white/10" />
        </Card>
      ))}
    </div>
  );
}
