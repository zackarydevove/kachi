"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUserStore } from "@/store/user.store";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

const customerPortalLink =
  "https://billing.stripe.com/p/login/test_8x23cubkL5Hy9Hj8Sc4ow00";

const invoices = [
  {
    date: "Aug 05, 2025",
    status: "Paid",
    amount: "$250.00",
    invoice: "INV001",
  },
  {
    date: "Aug 05, 2025",
    status: "Pending",
    amount: "$150.00",
    invoice: "INV002",
  },
  {
    date: "Aug 05, 2025",
    status: "Unpaid",
    amount: "$350.00",
    invoice: "INV003",
  },
  {
    date: "Aug 05, 2025",
    status: "Paid",
    amount: "$450.00",
    invoice: "INV004",
  },
  {
    date: "Aug 05, 2025",
    status: "Paid",
    amount: "$550.00",
    invoice: "INV005",
  },
  {
    date: "Aug 05, 2025",
    status: "Pending",
    amount: "$200.00",
    invoice: "INV006",
  },
  {
    date: "Aug 05, 2025",
    status: "Unpaid",
    amount: "$300.00",
    invoice: "INV007",
  },
];

export default function BillingPage() {
  const { user } = useUserStore();

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex justify-end">
        <Button variant="outline" size="sm">
          <ExternalLink />
          <Link
            target="_blank"
            href={customerPortalLink + "?prefilled_email=" + user?.email}
          >
            Manage subscription
          </Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead className="text-right">Invoice</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.invoice}>
              <TableCell>{invoice.date}</TableCell>
              <TableCell>{invoice.status}</TableCell>
              <TableCell>{invoice.amount}</TableCell>
              <TableCell className="text-right flex justify-end">
                <div className="flex items-center gap-2 text-right hover:cursor-pointer hover:underline">
                  <ExternalLink size={16} />
                  <p>View</p>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
