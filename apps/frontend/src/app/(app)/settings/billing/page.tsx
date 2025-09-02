"use client";

import { StripeApi } from "@/api/stripe.api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUserStore } from "@/store/user.store";
import { StripeInvoice } from "@/types/stripe.type";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const customerPortalLink =
  "https://billing.stripe.com/p/login/test_8x23cubkL5Hy9Hj8Sc4ow00";

export default function BillingPage() {
  const [invoices, setInvoices] = useState<StripeInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const { user } = useUserStore();

  if (!user?.isPro) {
    router.push("/settings");
  }

  const stripeApi = new StripeApi();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const invoices = await stripeApi.getInvoices();
        setInvoices(invoices);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInvoices();
  }, []);

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
          {isLoading ? (
            <TableRow>
              <TableCell>
                <Skeleton className="h-4 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 rounded-full" />
              </TableCell>
            </TableRow>
          ) : (
            invoices?.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>{invoice.status}</TableCell>
                <TableCell>{invoice.amount}</TableCell>
                <TableCell className="text-right flex justify-end">
                  <Link
                    className="flex items-center gap-2 text-right hover:cursor-pointer hover:underline"
                    target="_blank"
                    href={invoice.link}
                  >
                    <ExternalLink size={16} />
                    <p>View</p>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
