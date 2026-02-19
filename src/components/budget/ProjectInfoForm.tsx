
import React from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { FileText, Calendar } from 'lucide-react';

interface ProjectInfoFormProps {
    formData: {
        project: string;
        date: string;
        reason: string;
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const ProjectInfoForm: React.FC<ProjectInfoFormProps> = ({ formData, handleChange }) => {
    return (
        <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
                    <FileText size={18} />
                </div>
                ข้อมูลโครงการ
            </h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">ชื่อโครงการ / รายการ</label>
                    <Input
                        name="project"
                        value={formData.project}
                        onChange={handleChange}
                        placeholder="ตัวอย่าง: โครงการอบรม..."
                        required
                        className="font-bold"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">วันที่ทำรายการ</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="pl-10 font-bold"
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">เหตุผลและความจำเป็น</label>
                    <textarea
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium text-gray-600"
                        placeholder="อธิบายเหตุผลและความจำเป็น..."
                        required
                    />
                </div>
            </div>
        </Card>
    );
};
