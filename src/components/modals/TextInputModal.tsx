"use client";

import { KeyboardEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface TextInputModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  placeholder?: string;
  value: string;
  onValueChange: (value: string) => void;
  saveLabel?: string;
  cancelLabel?: string;
  onSubmit: () => void;
}

export function TextInputModal({
  open,
  onOpenChange,
  title,
  description,
  placeholder,
  value,
  onValueChange,
  saveLabel = "Save",
  cancelLabel = "Cancel",
  onSubmit,
}: TextInputModalProps) {
  const handleEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    onSubmit();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Input
            placeholder={placeholder}
            value={value}
            onChange={(event) => onValueChange(event.target.value)}
            onKeyDown={handleEnter}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {cancelLabel}
          </Button>
          <Button
            onClick={() => {
              onSubmit();
            }}
          >
            {saveLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
