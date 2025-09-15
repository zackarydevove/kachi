import { useCallback, useEffect, useState } from "react";
import { PlaidLinkOptions, usePlaidLink } from "react-plaid-link";
import { Button } from "../ui/button";
import { PlaidApi } from "@/api/plaid.api";
import { Loader2Icon } from "lucide-react";
import { useUserStore } from "@/store/user.store";
import { useAccountStore } from "@/store/account.store";

export default function ConnectPlaidButton() {
  const [linkToken, setLinkToken] = useState("");

  const user = useUserStore((state) => state.user);
  const activeAccount = useAccountStore((state) => state.activeAccount);
  const plaidApi = new PlaidApi();

  useEffect(() => {
    const getLinkToken = async (accountId: number) => {
      try {
        const data = await plaidApi.generateLinkToken(accountId);
        setLinkToken(data.linkToken);
      } catch (error) {
        console.error("Error getting link token: ", error);
        return;
      }
    };
    if (!activeAccount?.id) return;
    getLinkToken(activeAccount.id);
  }, []);

  const config: PlaidLinkOptions = {
    token: linkToken,
    onSuccess: useCallback(
      async (publicToken: string) => {
        try {
          if (!activeAccount?.id) {
            throw new Error("Account ID is required");
          }
          const data = await plaidApi.exchangePublicToken(
            publicToken,
            activeAccount.id
          );
        } catch (error) {
          // show error
          console.error("Error exchanging public token: ", error);
          return;
        }
      },
      [user]
    ),
  };

  const { open, ready } = usePlaidLink(config);

  return (
    <Button type="button" onClick={() => open()} disabled={!ready}>
      {!ready ? (
        <Loader2Icon className="animate-spin" />
      ) : (
        "Connect Investment Account"
      )}
    </Button>
  );
}
