"use client";

import { useFormStatus } from "react-dom";
import { Button } from "~/components/ui/button";

export function RefreshButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="outline" loading={pending}>
      New Prompt
    </Button>
  );
}
