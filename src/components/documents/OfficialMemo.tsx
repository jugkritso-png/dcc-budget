import React from 'react';
import { BudgetRequest, Category } from '../../types';
import { FileText, Printer } from 'lucide-react';

interface OfficialMemoProps {
    request: BudgetRequest;
    category: Category | null;
    onClose: () => void;
}

export const OfficialMemo: React.FC<OfficialMemoProps> = ({ request, category, onClose }) => {
    const handlePrint = () => {
        window.print();
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const thaiMonths = [
            'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
            'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
        ];
        const day = date.getDate();
        const month = thaiMonths[date.getMonth()];
        const year = date.getFullYear() + 543; // Convert to Buddhist Era
        return `${day} ${month} ${year}`;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('th-TH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white/80 backdrop-blur-2xl rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/60 ring-1 ring-black/5">
                {/* Header Actions */}
                <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center print:hidden z-10">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                        <FileText className="w-6 h-6 text-blue-600" />
                        บันทึกข้อความ
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={handlePrint}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <Printer className="w-4 h-4" />
                            พิมพ์
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            ปิด
                        </button>
                    </div>
                </div>

                {/* Official Memo Content */}
                <div className="p-12 bg-white" id="memo-content">
                    {/* University Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold mb-2">มหาวิทยาลัยวลัยลักษณ์</h1>
                        <h2 className="text-xl font-semibold">บันทึกข้อความ</h2>
                    </div>

                    {/* Routing Information */}
                    <div className="mb-6 space-y-2">
                        <div className="flex">
                            <span className="w-32 font-semibold">ส่วนราชการ</span>
                            <span>{request.department || 'ไม่ระบุ'}</span>
                        </div>
                        <div className="flex">
                            <span className="w-32 font-semibold">ที่</span>
                            <span>{request.approvalRef || '-'}</span>
                        </div>
                        <div className="flex">
                            <span className="w-32 font-semibold">วันที่</span>
                            <span>{formatDate(request.date)}</span>
                        </div>
                    </div>

                    {/* Subject */}
                    <div className="mb-6">
                        <div className="flex">
                            <span className="w-32 font-semibold">เรื่อง</span>
                            <span>ขออนุมัติงบประมาณโครงการ {request.project}</span>
                        </div>
                    </div>

                    {/* Recipient */}
                    <div className="mb-6">
                        <span className="font-semibold">เรียน</span>
                        <span className="ml-2">ผู้อำนวยการกองแผนงาน</span>
                    </div>

                    {/* Body Content */}
                    <div className="space-y-4 text-justify leading-relaxed mb-6">
                        <p className="indent-12">
                            ตามที่ {request.department || 'หน่วยงาน'} มีความประสงค์จะดำเนินโครงการ{' '}
                            <span className="font-semibold">{request.project}</span>{' '}
                            {request.reason && `โดยมีวัตถุประสงค์เพื่อ${request.reason}`} นั้น
                        </p>

                        {/* Project Details */}
                        <div className="ml-12 space-y-3">
                            <p className="font-semibold">รายละเอียดโครงการ</p>

                            <div className="space-y-2">
                                <div className="flex">
                                    <span className="w-48 font-medium">ชื่อโครงการ:</span>
                                    <span>{request.project}</span>
                                </div>
                                <div className="flex">
                                    <span className="w-48 font-medium">หมวดงบประมาณ:</span>
                                    <span>{request.category}</span>
                                </div>
                                <div className="flex">
                                    <span className="w-48 font-medium">กิจกรรม:</span>
                                    <span>{request.activity}</span>
                                </div>
                                <div className="flex">
                                    <span className="w-48 font-medium">งบประมาณที่ขอ:</span>
                                    <span className="font-semibold">{formatCurrency(request.amount)} บาท</span>
                                </div>
                                {request.startDate && request.endDate && (
                                    <div className="flex">
                                        <span className="w-48 font-medium">ระยะเวลาดำเนินการ:</span>
                                        <span>{formatDate(request.startDate)} - {formatDate(request.endDate)}</span>
                                    </div>
                                )}
                            </div>

                            {/* Budget Codes Section */}
                            {category && (category.businessPlace || category.fundCenter || category.costCenter) && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="font-semibold mb-2">รหัสงบประมาณ</p>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        {category.businessPlace && (
                                            <div className="flex">
                                                <span className="w-48 font-medium">Business Place:</span>
                                                <span>{category.businessPlace}</span>
                                            </div>
                                        )}
                                        {category.businessArea && (
                                            <div className="flex">
                                                <span className="w-48 font-medium">Business Area:</span>
                                                <span>{category.businessArea}</span>
                                            </div>
                                        )}
                                        {category.fund && (
                                            <div className="flex">
                                                <span className="w-48 font-medium">Fund:</span>
                                                <span>{category.fund} ({category.fund === 'I' ? 'เงินภายใน' : 'เงินภายนอก'})</span>
                                            </div>
                                        )}
                                        {category.fundCenter && (
                                            <div className="flex">
                                                <span className="w-48 font-medium">Fund Center:</span>
                                                <span>{category.fundCenter}</span>
                                            </div>
                                        )}
                                        {category.costCenter && (
                                            <div className="flex">
                                                <span className="w-48 font-medium">Cost Center:</span>
                                                <span>{category.costCenter}</span>
                                            </div>
                                        )}
                                        {category.functionalArea && (
                                            <div className="flex">
                                                <span className="w-48 font-medium">Functional Area:</span>
                                                <span>{category.functionalArea}</span>
                                            </div>
                                        )}
                                        {category.commitmentItem && (
                                            <div className="flex">
                                                <span className="w-48 font-medium">Commitment Item:</span>
                                                <span>{category.commitmentItem}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {request.notes && (
                                <div className="mt-3">
                                    <p className="font-medium">หมายเหตุ:</p>
                                    <p className="text-gray-700">{request.notes}</p>
                                </div>
                            )}
                        </div>

                        <p className="indent-12 mt-4">
                            จึงเรียนมาเพื่อโปรดพิจารณาอนุมัติงบประมาณดังกล่าว
                        </p>
                    </div>

                    {/* Signature Section */}
                    <div className="mt-12 flex justify-end">
                        <div className="text-center space-y-8">
                            <div>
                                <p>ลงชื่อ ........................................</p>
                                <p className="mt-2">({request.requester})</p>
                                <p>ผู้เสนอโครงการ</p>
                            </div>

                            <div>
                                <p>ลงชื่อ ........................................</p>
                                <p className="mt-2">(........................................)</p>
                                <p>หัวหน้าหน่วยงาน</p>
                            </div>

                            <div>
                                <p>ลงชื่อ ........................................</p>
                                <p className="mt-2">(........................................)</p>
                                <p>ผู้อำนวยการกองแผนงาน</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #memo-content, #memo-content * {
            visibility: visible;
          }
          #memo-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 2cm;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
        </div>
    );
};
