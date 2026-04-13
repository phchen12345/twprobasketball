import Link from "next/link";
import { Button } from "@/components/ui/button";

export function MyTeamsHeader() {
  return (
    <Link href="/">
      <Button variant="pill" size="pill">
        回首頁
      </Button>
    </Link>
  );
}
