import { notFound, redirect } from "next/navigation";

import type { LearningEnvironment, MissionId } from "@/lib/journey-types";

type MissionRoute = `/mission/${LearningEnvironment}/${MissionId}`;

const legacyStageRoutes = {
  "w1-pc-copy-paste": "/mission/windows/copy-paste",
  "w1-mobile-copy-paste": "/mission/iphone/copy-paste",
  "w2-pc-find-settings": "/mission/windows/menu-discovery",
  "w2-mobile-more-menu": "/mission/iphone/menu-discovery",
  "w3-pc-search-tabs": "/mission/windows/tabs-compare",
  "w3-mobile-search-back": "/mission/iphone/navigation",
  "w4-pc-password-recovery": "/mission/windows/account-recovery",
  "w4-mobile-switch-account": "/mission/iphone/permission-decision",
  "w5-pc-download-attach": "/mission/windows/attach-review",
  "w5-mobile-share-attach": "/mission/iphone/attach-review",
  "w6-pc-hidden-button": "/mission/windows/error-reading",
  "w6-mobile-ask-for-help": "/mission/iphone/help-search",
  "w7-pc-independent-file": "/mission/windows/independent-file",
  "w7-mobile-independent-research": "/mission/iphone/independent-research",
} as const satisfies Record<string, MissionRoute>;

export function generateStaticParams() {
  return Object.keys(legacyStageRoutes).map((stageId) => ({ stageId }));
}

export default async function LegacyPlayPage({ params }: { params: Promise<{ stageId: string }> }) {
  const { stageId } = await params;
  const target = legacyStageRoutes[stageId as keyof typeof legacyStageRoutes];
  if (!target) notFound();
  redirect(target);
}
