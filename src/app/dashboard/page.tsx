import { Metadata } from "next";
import { DashboardPage } from "./DashboardPage";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Protected dashboard with access to invoices and orders grids.",
};

export default function DashboardRoutePage() {
  return <DashboardPage />;
}
