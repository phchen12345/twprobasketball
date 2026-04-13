"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getSelectableTeams } from "../lib/teams";
import { useAuth } from "../components/auth/AuthProvider";
import { useFavoriteTeams } from "./useFavoriteTeams";
import { MyTeamsError } from "./MyTeamsError";
import { MyTeamsHeader } from "./MyTeamsHeader";
import { MyTeamsIntro } from "./MyTeamsIntro";
import { TeamGrid } from "./TeamGrid";
import { TeamGridSkeleton } from "./TeamGridSkeleton";

export default function MyTeamsPage() {
  const router = useRouter();
  const { accessToken, isLoading: isAuthLoading, user } = useAuth();
  const teams = useMemo(() => getSelectableTeams(), []);
  const {
    error,
    isTeamFavorite,
    isTeamPending,
    status,
    toggleFavorite,
  } = useFavoriteTeams({
    accessToken,
    enabled: Boolean(accessToken && user),
  });
  const shouldShowSkeleton =
    isAuthLoading || !accessToken || !user || status === "idle" || status === "loading";

  useEffect(() => {
    if (!isAuthLoading && (!accessToken || !user)) {
      router.replace("/");
    }
  }, [accessToken, isAuthLoading, router, user]);

  return (
    <main className="min-h-screen bg-[#0b0d12] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <MyTeamsHeader />

        <section
          className="rounded-2xl border border-white/10 bg-white/8 p-5 shadow-[0_18px_48px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-6"
          aria-busy={shouldShowSkeleton}
          aria-live="polite"
        >
          <MyTeamsIntro />

          {error ? <MyTeamsError message={error.message} /> : null}

          {shouldShowSkeleton ? (
            <TeamGridSkeleton />
          ) : (
            <TeamGrid
              teams={teams}
              isTeamFavorite={isTeamFavorite}
              isTeamPending={isTeamPending}
              onToggleFavorite={toggleFavorite}
            />
          )}
        </section>
      </div>
    </main>
  );
}
