
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { paymentService } from '@/lib/services/paymentService';
import type { Payment } from '@/lib/types';
import { useState } from 'react';

const refundSchema = z.object({
  amount: z.coerce.number().positive('Refund amount must be positive.'),
  reason: z.string().min(10, 'A reason for the refund is required.'),
});

type RefundFormValues = z.infer<typeof refundSchema>;

interface RefundDialogProps {
  payment: Payment | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function RefundDialog({ payment, isOpen, onOpenChange, onSuccess }: RefundDialogProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<RefundFormValues>({
    resolver: zodResolver(refundSchema),
    defaultValues: {
      amount: payment?.amount || 0,
      reason: '',
    },
  });
  
  const refundMutation = useMutation({
    mutationFn: (data: { amount: number; reason: string }) => {
        if (!payment) throw new Error("No payment selected for refund");
        return paymentService.refundPayment(payment.id, data);
    },
    onSuccess: () => {
        toast.success("Refund processed successfully.");
        queryClient.invalidateQueries({ queryKey: ['payments'] });
        queryClient.invalidateQueries({ queryKey: ['paymentSummary'] });
        onSuccess();
        onOpenChange(false);
    },
    onError: (error: any) => {
        toast.error(error.message || "Failed to process refund.");
    },
    onSettled: () => {
        setIsConfirmOpen(false);
    }
  });

  const onSubmit = () => {
    form.trigger().then(isValid => {
        if (isValid) {
            if (form.getValues('amount') > (payment?.amount ?? 0)) {
                form.setError('amount', { message: 'Refund cannot exceed original payment amount.' });
                return;
            }
            setIsConfirmOpen(true);
        }
    });
  };
  
  const confirmRefund = () => {
    refundMutation.mutate(form.getValues());
  }

  if (!payment) return null;

  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Refund Payment</AlertDialogTitle>
            <AlertDialogDescription>
              Process a refund for payment {payment.id}. This action is irreversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Form {...form}>
            <form className="space-y-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Refund Amount (Max: ${payment.amount.toFixed(2)})</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Refund</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Guest cancellation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button onClick={onSubmit}>Proceed</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will refund ${form.getValues('amount').toFixed(2)} to the guest. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRefund} disabled={refundMutation.isPending}>
              {refundMutation.isPending ? 'Refunding...' : 'Confirm Refund'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

    