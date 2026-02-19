
import { useState, useMemo } from 'react';
import { BudgetRequest } from '../types';

export const useBudgetFilters = (requests: BudgetRequest[]) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredRequests = useMemo(() => {
        return requests.filter(req => {
            const matchesSearch = req.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
                req.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = categoryFilter === 'all' || req.category === categoryFilter;
            const matchesStatus = statusFilter === 'all' || req.status === statusFilter;

            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [requests, searchTerm, categoryFilter, statusFilter]);

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setCategoryFilter('all');
    };

    return {
        searchTerm,
        setSearchTerm,
        categoryFilter,
        setCategoryFilter,
        statusFilter,
        setStatusFilter,
        filteredRequests,
        clearFilters
    };
};
