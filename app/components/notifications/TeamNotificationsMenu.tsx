"use client";

import { useEffect, useRef, useState } from "react";
import { BellButton } from "./BellButton";
import { NotificationDropdown } from "./NotificationDropdown";
import { useTeamNotifications } from "./useTeamNotifications";

type TeamNotificationsMenuProps = {
  isCompact?: boolean;
};

export function TeamNotificationsMenu({
  isCompact = false,
}: TeamNotificationsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const {
    games,
    isAuthenticated,
    markCurrentNotificationsRead,
    status,
    unreadCount,
  } = useTeamNotifications();

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  function handleToggleMenu() {
    setIsOpen((current) => {
      const nextIsOpen = !current;

      if (nextIsOpen) {
        markCurrentNotificationsRead();
      }

      return nextIsOpen;
    });
  }

  return (
    <div ref={menuRef} className="relative shrink-0">
      <BellButton
        isOpen={isOpen}
        onClick={handleToggleMenu}
        unreadCount={unreadCount}
      />

      {isOpen ? (
        <NotificationDropdown
          games={games}
          isCompact={isCompact}
          status={status}
        />
      ) : null}
    </div>
  );
}
