import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { PROTECTED_URL } from "@/config/url.config";

interface GridPageHeaderProps {
  title: string;
  description: string;
}

export function GridPageHeader({ title, description }: GridPageHeaderProps) {
  return (
    <header className="mb-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button asChild variant="outline">
              <Link href={PROTECTED_URL.dashboard()}>Back to dashboard</Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Return to protected workspace overview.</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </header>
  );
}
