"use client";

import { useState } from "react";
import { CopyPlus, Loader2, RotateCcw, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { TextInputModal } from "@/components/modals/TextInputModal";
import { UserView } from "@/shared/types/Views.interface";

interface AGGridTableHeaderProps {
  title: string;
  views: UserView[];
  isViewsLoading: boolean;
  selectedViewId: string;
  isDefaultViewSelected: boolean;
  isBusy: boolean;
  isDirty: boolean;
  onSelectView: (value: string) => void;
  onSaveCurrentView: () => Promise<void>;
  onSaveAsNewView: (name: string) => Promise<void>;
  onResetToDefault: () => void;
  onDeleteView: () => Promise<void>;
}

const DEFAULT_VIEW_ID = "default";

export function AGGridTableHeader({
  title,
  views,
  isViewsLoading,
  selectedViewId,
  isDefaultViewSelected,
  isBusy,
  isDirty,
  onSelectView,
  onSaveCurrentView,
  onSaveAsNewView,
  onResetToDefault,
  onDeleteView,
}: AGGridTableHeaderProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [saveAsDialogOpen, setSaveAsDialogOpen] = useState(false);
  const [saveAsName, setSaveAsName] = useState("");
  const selectedViewName =
    selectedViewId === DEFAULT_VIEW_ID
      ? "Default View"
      : (views.find((view) => view.id === selectedViewId)?.name ?? "Default View");

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">{title}</h2>
          {isDirty ? <Badge variant="destructive">Unsaved changes</Badge> : null}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Select value={selectedViewId} onValueChange={onSelectView}>
            <SelectTrigger className="w-[220px]">
              <SelectValue>{selectedViewName}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {isViewsLoading ? (
                <div className="flex items-center gap-2 px-2 py-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  Loading views...
                </div>
              ) : (
                <>
                  <SelectItem value={DEFAULT_VIEW_ID}>Default View</SelectItem>
                  {views.map((view) => (
                    <SelectItem key={view.id} value={view.id}>
                      {view.name}
                    </SelectItem>
                  ))}
                </>
              )}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => {
                      if (isDefaultViewSelected) {
                        setSaveAsDialogOpen(true);
                        return;
                      }
                      void onSaveCurrentView();
                    }}
                    disabled={isBusy}
                    size="icon"
                    aria-label="Save view"
                  >
                    <Save />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Save current columns, sorting and filters.</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setSaveAsDialogOpen(true)}
                    disabled={isBusy}
                    variant="outline"
                    size="icon"
                    aria-label="Save as new view"
                  >
                    <CopyPlus />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Create a new variant without replacing the current view.</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setResetDialogOpen(true)}
                    disabled={isBusy}
                    variant="outline"
                    size="icon"
                    aria-label="Reset to default view"
                  >
                    <RotateCcw />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Discard applied custom view state.</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setDeleteDialogOpen(true)}
                    disabled={isBusy || isDefaultViewSelected}
                    variant="destructive"
                    size="icon"
                    aria-label="Delete view"
                  >
                    <Trash2 />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete selected saved view permanently.</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete selected view?"
        description="This action cannot be undone. The saved configuration will be removed."
        confirmLabel="Delete"
        confirmVariant="destructive"
        onConfirm={() => {
          void onDeleteView();
        }}
      />

      <ConfirmModal
        open={resetDialogOpen}
        onOpenChange={setResetDialogOpen}
        title="Reset to default view?"
        description="Your unsaved changes will be lost. Saved views will remain available."
        confirmLabel="Reset"
        onConfirm={onResetToDefault}
      />

      <TextInputModal
        open={saveAsDialogOpen}
        onOpenChange={setSaveAsDialogOpen}
        title="Save as new view"
        description="Enter a name for the new view configuration."
        placeholder="View name"
        value={saveAsName}
        onValueChange={setSaveAsName}
        onSubmit={() => {
          if (!saveAsName.trim()) {
            toast.error("Enter view name for Save As New.");
            return;
          }

          setSaveAsDialogOpen(false);
          void onSaveAsNewView(saveAsName);
          setSaveAsName("");
        }}
      />
    </>
  );
}
