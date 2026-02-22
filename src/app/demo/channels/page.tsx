"use client";

import { ChannelCard } from "@/components/channels/ChannelCard";
import { demoChannels } from "../demoData";

export default function DemoChannelsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Channels</h1>
        <p className="mt-1 text-sm text-neutral-400">
          {demoChannels.length} channels being tracked.
        </p>
      </div>
      <div className="space-y-3">
        {demoChannels.map((ch) => (
          <ChannelCard
            key={ch.id}
            channel={ch}
            onRemove={() => {}}
            onUpdate={() => {}}
          />
        ))}
      </div>
    </div>
  );
}
