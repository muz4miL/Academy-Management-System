import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, CheckCircle } from "lucide-react";
import { useRef } from "react";

interface PaymentReceiptProps {
    isOpen: boolean;
    onClose: () => void;
    voucherData: {
        voucherId: string;
        teacherName: string;
        subject: string;
        amountPaid: number;
        month: string;
        year: number;
        paymentDate: string;
        paymentMethod: string;
    } | null;
}

export const PaymentReceipt = ({ isOpen, onClose, voucherData }: PaymentReceiptProps) => {
    const printRef = useRef<HTMLDivElement>(null);

    if (!voucherData) return null;

    const handlePrint = () => {
        const printContent = printRef.current;
        if (!printContent) return;

        const printWindow = window.open('', '', 'height=600,width=800');
        if (!printWindow) return;

        printWindow.document.write(`
      <html>
        <head>
          <title>Payment Voucher - ${voucherData.voucherId}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              padding: 40px;
              background: white;
            }
            .receipt-container {
              max-width: 700px;
              margin: 0 auto;
              border: 2px solid #000;
              padding: 30px;
            }
            .header {
              text-align: center;
              border-bottom: 3px double #000;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header h1 {
              font-size: 28px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .header p {
              font-size: 14px;
              color: #666;
            }
            .voucher-id {
              background: #f3f4f6;
              padding: 10px;
              text-align: center;
              font-weight: bold;
              font-size: 18px;
              margin-bottom: 25px;
              border: 1px dashed #000;
            }
            .details-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 30px;
            }
            .detail-item {
              border-bottom: 1px solid #e5e7eb;
              padding-bottom: 8px;
            }
            .detail-label {
              font-size: 12px;
              color: #6b7280;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .detail-value {
              font-size: 16px;
              font-weight: 600;
              margin-top: 4px;
            }
            .amount-section {
              background: #10b981;
              color: white;
              padding: 20px;
              text-align: center;
              margin: 30px 0;
              border-radius: 8px;
            }
            .amount-section .label {
              font-size: 14px;
              opacity: 0.9;
            }
            .amount-section .amount {
              font-size: 32px;
              font-weight: bold;
              margin-top: 5px;
            }
            .signature-section {
              margin-top: 60px;
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 40px;
            }
            .signature-box {
              text-align: center;
            }
            .signature-line {
              border-top: 2px solid #000;
              margin-bottom: 8px;
              padding-top: 5px;
            }
            .signature-label {
              font-size: 12px;
              color: #666;
              text-transform: uppercase;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              text-align: center;
              font-size: 11px;
              color: #9ca3af;
            }
            @media print {
              body { padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                        Payment Voucher Generated
                    </DialogTitle>
                </DialogHeader>

                <div ref={printRef}>
                    <div className="receipt-container border-2 border-gray-900 p-8 bg-white">
                        {/* Header */}
                        <div className="header text-center border-b-4 border-double border-gray-900 pb-6 mb-8">
                            <h1 className="text-3xl font-bold mb-2">Academy Management System</h1>
                            <p className="text-sm text-gray-600">Peshawar, Khyber Pakhtunkhwa</p>
                            <p className="text-sm text-gray-600">Teacher Payment Voucher</p>
                        </div>

                        {/* Voucher ID */}
                        <div className="voucher-id bg-gray-100 border-2 border-dashed border-gray-900 p-3 text-center font-bold text-lg mb-6">
                            Voucher ID: {voucherData.voucherId}
                        </div>

                        {/* Details Grid */}
                        <div className="details-grid grid grid-cols-2 gap-6 mb-8">
                            <div className="detail-item border-b border-gray-300 pb-2">
                                <div className="detail-label text-xs text-gray-500 uppercase tracking-wide">Teacher Name</div>
                                <div className="detail-value text-base font-semibold mt-1">{voucherData.teacherName}</div>
                            </div>
                            <div className="detail-item border-b border-gray-300 pb-2">
                                <div className="detail-label text-xs text-gray-500 uppercase tracking-wide">Subject</div>
                                <div className="detail-value text-base font-semibold mt-1 capitalize">{voucherData.subject}</div>
                            </div>
                            <div className="detail-item border-b border-gray-300 pb-2">
                                <div className="detail-label text-xs text-gray-500 uppercase tracking-wide">Payment Period</div>
                                <div className="detail-value text-base font-semibold mt-1">{voucherData.month} {voucherData.year}</div>
                            </div>
                            <div className="detail-item border-b border-gray-300 pb-2">
                                <div className="detail-label text-xs text-gray-500 uppercase tracking-wide">Payment Date</div>
                                <div className="detail-value text-base font-semibold mt-1">
                                    {new Date(voucherData.paymentDate).toLocaleDateString('en-PK', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </div>
                            </div>
                            <div className="detail-item border-b border-gray-300 pb-2">
                                <div className="detail-label text-xs text-gray-500 uppercase tracking-wide">Payment Method</div>
                                <div className="detail-value text-base font-semibold mt-1 capitalize">{voucherData.paymentMethod}</div>
                            </div>
                        </div>

                        {/* Amount Section */}
                        <div className="amount-section bg-green-600 text-white p-6 text-center rounded-lg my-8">
                            <div className="label text-sm opacity-90">Amount Paid</div>
                            <div className="amount text-4xl font-bold mt-2">PKR {voucherData.amountPaid.toLocaleString()}</div>
                        </div>

                        {/* Signature Section */}
                        <div className="signature-section grid grid-cols-2 gap-12 mt-16">
                            <div className="signature-box text-center">
                                <div className="signature-line border-t-2 border-gray-900 pt-2 mb-2"></div>
                                <div className="signature-label text-xs text-gray-600 uppercase">Teacher's Signature</div>
                            </div>
                            <div className="signature-box text-center">
                                <div className="signature-line border-t-2 border-gray-900 pt-2 mb-2"></div>
                                <div className="signature-label text-xs text-gray-600 uppercase">Authorized By (Admin)</div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="footer mt-12 pt-6 border-t border-gray-300 text-center text-xs text-gray-500">
                            <p>This is a computer-generated voucher. Please retain for your records.</p>
                            <p className="mt-1">For queries, contact academy administration.</p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6 no-print">
                    <Button
                        onClick={handlePrint}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                        <Printer className="mr-2 h-4 w-4" />
                        Print Receipt
                    </Button>
                    <Button
                        onClick={onClose}
                        variant="outline"
                        className="flex-1"
                    >
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
