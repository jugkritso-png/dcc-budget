
import React from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { FileText, Calendar } from 'lucide-react';

interface ProjectInfoFormProps {
    formData: {
        project: string;
        date: string;
        bookNumber: string; // Added bookNumber
        reason: string;
        startDate: string;
        endDate: string;
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const ProjectInfoForm: React.FC<ProjectInfoFormProps> = ({ formData, handleChange }) => {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
                1. ข้อมูลโครงการ
            </h3>
            <div className="grid grid-cols-1 gap-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">เลขที่หนังสือ</label>
                    <Input
                        name="bookNumber"
                        value={formData.bookNumber}
                        handleChange={handleChange}
                        placeholder="ระบุเลขที่หนังสือ (ถ้ามี)"
                        className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">ชื่อโครงการ/กิจกรรม <span className="text-red-500">*</span></label>
                    <Input
                        name="project"
                        value={formData.project}
                        handleChange={handleChange}
                        placeholder="ระบุชื่อโครงการหรือกิจกรรม"
                        required
                        className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">วันที่เริ่มต้น</label>
                        <Input
                            type="date"
                            name="startDate"
                            value={formData.startDate} // Ensure these match the interface logic
                            handleChange={handleChange}
                            className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">วันที่สิ้นสุด</label>
                        <Input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            handleChange={handleChange}
                            className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">เหตุผลความจำเป็น / วัตถุประสงค์</label>
                    <textarea
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium text-gray-600 resize-none"
                        placeholder="อธิบายรายละเอียดและความจำเป็นของโครงการ..."
                        required
                    />
                </div>
            </div>
        </div>
    );
};
