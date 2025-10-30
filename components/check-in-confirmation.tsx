"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface CheckInConfirmationProps {
    period: string
    isFailed: boolean
    onConfirm: () => void
    onCancel: () => void
    isLoading: boolean
}

export default function CheckInConfirmation({
    period,
    isFailed,
    onConfirm,
    onCancel,
    isLoading,
}: CheckInConfirmationProps) {
    const periodLabel = period.charAt(0).toUpperCase() + period.slice(1)

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="bg-card border-border/50 p-6 max-w-sm mx-4">
                <h3 className="text-lg font-bold text-foreground mb-2">Confirm Check-in</h3>
                <p className="text-muted-foreground mb-6">
                    Are you sure you want to mark {periodLabel} as{" "}
                    <span className={isFailed ? "text-destructive font-bold" : "text-green-500 font-bold"}>
                        {isFailed ? "Failed" : "Safe"}
                    </span>
                    ?
                </p>
                {isFailed && (
                    <p className="text-sm text-destructive mb-4 bg-destructive/10 p-3 rounded border border-destructive/50">
                        ⚠️ This will count as a strike. 3 strikes and you&apos;re out!
                    </p>
                )}
                <div className="flex gap-3">
                    <Button onClick={onCancel} disabled={isLoading} variant="outline" className="flex-1 bg-transparent">
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`flex-1 ${isFailed ? "bg-destructive hover:bg-destructive/90" : "bg-green-500 hover:bg-green-600"
                            }`}
                    >
                        {isLoading ? "Saving..." : "Confirm"}
                    </Button>
                </div>
            </Card>
        </div>
    )
}
