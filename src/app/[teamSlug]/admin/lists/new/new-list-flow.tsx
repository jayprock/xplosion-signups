"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Music,
  UtensilsCrossed,
  Plus,
  ChevronRight,
} from "lucide-react";
import type { Player } from "@/lib/types";
import { ListForm } from "../../list-form";
import {
  LIST_TEMPLATES,
  type ListTemplate,
  type ListTemplateData,
} from "../../list-templates";

type NewListFlowProps = {
  teamSlug: string;
  teamName: string;
  players: Player[];
};

const TEMPLATE_STYLES: Record<
  string,
  {
    bg: string;
    ringHover: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  "walk-up-songs": {
    bg: "bg-red-600",
    ringHover: "hover:ring-red-500/20",
    icon: Music,
  },
  "snack-duty": {
    bg: "bg-amber-500",
    ringHover: "hover:ring-amber-500/20",
    icon: UtensilsCrossed,
  },
};

export function NewListFlow({ teamSlug, teamName, players }: NewListFlowProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<
    ListTemplate | "blank" | null
  >(null);

  if (selectedTemplate) {
    const isWalkUp =
      selectedTemplate !== "blank" && selectedTemplate.id === "walk-up-songs";
    const template: ListTemplateData | undefined =
      selectedTemplate === "blank"
        ? undefined
        : {
            name: selectedTemplate.name,
            category: selectedTemplate.category,
            fields: selectedTemplate.fields,
            slotsNeeded:
              isWalkUp && players.length > 0
                ? players.length
                : selectedTemplate.slotsNeeded,
            note: selectedTemplate.note,
          };

    return (
      <ListForm
        mode="create"
        teamSlug={teamSlug}
        teamName={teamName}
        template={template}
        rosterPlayers={isWalkUp ? players : undefined}
        onBack={() => setSelectedTemplate(null)}
      />
    );
  }

  return (
    <div className="min-h-dvh bg-neutral-100">
      <header className="bg-neutral-950 text-white">
        <div className="h-1 bg-gradient-to-r from-red-900 via-red-500 to-red-900" />
        <div className="max-w-lg mx-auto px-4 py-4">
          <Link
            href={`/${teamSlug}/admin`}
            className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="size-3.5" />
            Dashboard
          </Link>
          <h1 className="font-heading text-3xl tracking-tight leading-none mt-2">
            NEW LIST
          </h1>
          <p className="text-neutral-500 text-sm">{teamName}</p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-3">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400 px-1 mb-1">
          Choose a Template
        </h2>

        {LIST_TEMPLATES.map((template, i) => {
          const style = TEMPLATE_STYLES[template.id];
          const Icon = style?.icon || Plus;
          const bg = style?.bg || "bg-neutral-600";
          const ringHover = style?.ringHover || "";
          const isWalkUp = template.id === "walk-up-songs";

          return (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template)}
              className={`w-full bg-white rounded-2xl ring-1 ring-black/[0.04] shadow-sm p-4 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 hover:ring-2 ${ringHover} transition-all duration-200 text-left group opacity-0 animate-fade-in-up`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div
                className={`size-11 rounded-xl ${bg} flex items-center justify-center shrink-0 shadow-sm`}
              >
                <Icon className="size-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-neutral-900 text-[15px]">
                  {template.name}
                </p>
                <p className="text-sm text-neutral-500 leading-snug">
                  {template.description}
                </p>
                {isWalkUp && players.length > 0 && (
                  <p className="text-xs text-red-600 font-medium mt-1">
                    {players.length} roster player
                    {players.length !== 1 ? "s" : ""} will be auto-added
                  </p>
                )}
              </div>
              <ChevronRight className="size-4 text-neutral-300 group-hover:text-neutral-500 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>
          );
        })}

        {/* Start from scratch */}
        <button
          onClick={() => setSelectedTemplate("blank")}
          className="w-full rounded-2xl border-2 border-dashed border-neutral-300 p-4 flex items-center gap-4 hover:border-neutral-400 hover:bg-white/60 transition-all duration-200 text-left group opacity-0 animate-fade-in-up"
          style={{ animationDelay: `${LIST_TEMPLATES.length * 80}ms` }}
        >
          <div className="size-11 rounded-xl bg-neutral-200 flex items-center justify-center shrink-0 group-hover:bg-neutral-300 transition-colors">
            <Plus className="size-5 text-neutral-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-neutral-600 text-[15px]">
              Start from Scratch
            </p>
            <p className="text-sm text-neutral-400 leading-snug">
              Create a custom list with your own fields
            </p>
          </div>
          <ChevronRight className="size-4 text-neutral-300 group-hover:text-neutral-400 group-hover:translate-x-0.5 transition-all shrink-0" />
        </button>
      </main>
    </div>
  );
}
