import { useState } from "react";
import { toast } from "sonner";
import { Banknote } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { WITHDRAW_FEE, balances, bankAccounts } from "@/lib/mock/finance";
import { formatBRL } from "@/lib/format";

export function WithdrawDialog() {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(balances.available);
  const [account, setAccount] = useState(bankAccounts[0]!.id);

  const value = Number.isFinite(amount) ? Math.min(Math.max(amount, 0), balances.available) : 0;
  const net = Math.max(0, value - WITHDRAW_FEE);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90">
          <Banknote className="h-4 w-4" />
          Solicitar saque
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Solicitar saque</DialogTitle>
          <DialogDescription>
            Disponível para saque: {formatBRL(balances.available)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">Valor do saque</span>
            <input
              type="number"
              value={value}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">Conta de destino</span>
            <select
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary/60"
            >
              {bankAccounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label}
                </option>
              ))}
            </select>
          </label>

          <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Taxa de transferência</span>
              <span className="tabular-nums">{formatBRL(WITHDRAW_FEE)}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-border pt-2 font-semibold text-foreground">
              <span>Você recebe</span>
              <span className="tabular-nums">{formatBRL(net)}</span>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Liquidação em até 1 dia útil para contas do mesmo titular.
            </p>
          </div>
        </div>

        <DialogFooter>
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              setOpen(false);
              toast.success("Saque solicitado", {
                description: `${formatBRL(net)} a caminho de ${bankAccounts.find((a) => a.id === account)?.label}.`,
              });
            }}
            disabled={value <= WITHDRAW_FEE}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
          >
            Confirmar saque
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
