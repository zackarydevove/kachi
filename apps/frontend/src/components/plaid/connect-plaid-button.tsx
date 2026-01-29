import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  PlaidLinkOnEventMetadata,
  PlaidLinkOptions,
  PlaidLinkStableEvent,
  usePlaidLink,
} from "react-plaid-link";
import { Button } from "../ui/button";
import { PlaidApi } from "@/api/plaid.api";
import { Loader2Icon } from "lucide-react";
import { useUserStore } from "@/store/user.store";
import { useAccountStore } from "@/store/account.store";
import { useRouter } from "next/navigation";
import { useAssetStore } from "@/store/asset.store";

interface ConnectPlaidButtonProps {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  closeDialog: () => void;
}

export default function ConnectPlaidButton(props: ConnectPlaidButtonProps) {
  const [linkToken, setLinkToken] = useState("");
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const activeAccount = useAccountStore((state) => state.activeAccount);
  const plaidApi = new PlaidApi();
  const getAllAssets = useAssetStore((state) => state.getAllAssets);

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
    if (!activeAccount?.id || !user?.isPro) return;
    getLinkToken(activeAccount.id);
  }, []);

  const config: PlaidLinkOptions = {
    token: linkToken,
    onExit: (err, metadata) => {
      props.setLoading(false);
    },
    onEvent: (
      eventName: PlaidLinkStableEvent | string,
      metadata: PlaidLinkOnEventMetadata,
    ) => {
      switch (eventName) {
        case PlaidLinkStableEvent.OPEN:
          props.setLoading(true);
          break;
        case PlaidLinkStableEvent.EXIT:
          props.setLoading(false);
          break;
      }
    },
    onSuccess: useCallback(
      async (publicToken: string) => {
        props.setLoading(true);
        try {
          if (!activeAccount?.id) {
            throw new Error("Account ID is required");
          }
          const data = await plaidApi.exchangePublicToken(
            publicToken,
            activeAccount.id,
          );
          // if success, refresh the assets
          await getAllAssets();
        } catch (error) {
          // show error
          console.error("Error exchanging public token: ", error);
          return;
        } finally {
          props.setLoading(false);
          props.closeDialog();
        }
      },
      [user],
    ),
  };

  const { open, ready } = usePlaidLink(config);

  if (!user?.isPro) {
    return (
      <Button type="button" onClick={() => router.push("/pro")}>
        Connect Investment Account
      </Button>
    );
  }

  return (
    <Button
      type="button"
      onClick={() => {
        props.setLoading(true);
        open();
      }}
      disabled={!ready || props.loading}
    >
      {!ready || props.loading ? (
        <Loader2Icon className="animate-spin" />
      ) : (
        "Connect Investment Account"
      )}
    </Button>
  );
}
