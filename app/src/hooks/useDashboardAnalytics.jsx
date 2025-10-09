import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/apiService.js';
import { useErrorHandler } from './useErrorHandler.jsx';

// custom hook for managing dashboard analytics data w/ loading state, handlingerrors, and data fetching for dashboard

export const useDashboardAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    overview: null,
    equipmentMetrics: null,
    accountCounts: null,
    equipmentStatus: null,
    equipmentFunctionality: null,
    equipmentByLocation: null,
    systemHealth: null
  });

  const { handleError } = useErrorHandler();

  // fetch dashboard overview data
  const fetchDashboardOverview = useCallback(async () => {
    try {
      const result = await apiService.getDashboardOverview();
      if (result.success) {
        setDashboardData(prev => ({ ...prev, overview: result.data }));
      } else {
        handleError(new Error(result.error), false);
      }
    } catch (error) {
      handleError(error, false);
    }
  }, [handleError]);

  // fetch equipment dashboard metrics
  const fetchEquipmentMetrics = useCallback(async () => {
    try {
      const result = await apiService.getEquipmentDashboardMetrics();
      if (result.success) {
        setDashboardData(prev => ({ ...prev, equipmentMetrics: result.data }));
      } else {
        handleError(new Error(result.error), false);
      }
    } catch (error) {
      handleError(error, false);
    }
  }, [handleError]);

  // fetch account counts analytics
  const fetchAccountCounts = useCallback(async (params = {}) => {
    try {
      const result = await apiService.getAccountCounts(params);
      if (result.success) {
        setDashboardData(prev => ({ ...prev, accountCounts: result.data }));
      } else {
        handleError(new Error(result.error), false);
      }
    } catch (error) {
      handleError(error, false);
    }
  }, [handleError]);

  // fetch equipment status analytics
  const fetchEquipmentStatus = useCallback(async (params = {}) => {
    try {
      const result = await apiService.getEquipmentStatus(params);
      if (result.success) {
        setDashboardData(prev => ({ ...prev, equipmentStatus: result.data }));
      } else {
        handleError(new Error(result.error), false);
      }
    } catch (error) {
      handleError(error, false);
    }
  }, [handleError]);

  // fetch equipment functionality analytics
  const fetchEquipmentFunctionality = useCallback(async (params = {}) => {
    try {
      const result = await apiService.getEquipmentFunctionality(params);
      if (result.success) {
        setDashboardData(prev => ({ ...prev, equipmentFunctionality: result.data }));
      } else {
        handleError(new Error(result.error), false);
      }
    } catch (error) {
      handleError(error, false);
    }
  }, [handleError]);

  // fetch equipment by location analytics
  const fetchEquipmentByLocation = useCallback(async (params = {}) => {
    try {
      const result = await apiService.getEquipmentByLocation(params);
      if (result.success) {
        setDashboardData(prev => ({ ...prev, equipmentByLocation: result.data }));
      } else {
        handleError(new Error(result.error), false);
      }
    } catch (error) {
      handleError(error, false);
    }
  }, [handleError]);

  // fetch system health analytics
  const fetchSystemHealth = useCallback(async () => {
    try {
      const result = await apiService.getSystemHealth();
      if (result.success) {
        setDashboardData(prev => ({ ...prev, systemHealth: result.data }));
      } else {
        handleError(new Error(result.error), false);
      }
    } catch (error) {
      handleError(error, false);
    }
  }, [handleError]);

  // fetch all dashboard data
  const fetchAllDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.allSettled([
        fetchDashboardOverview(),
        fetchEquipmentMetrics(),
        fetchAccountCounts({ group_by: 'status' }),
        fetchEquipmentStatus({ chart_type: 'pie' }),
        fetchEquipmentFunctionality(),
        fetchEquipmentByLocation({ chart_type: 'bar' }),
        fetchSystemHealth()
      ]);
    } finally {
      setLoading(false);
    }
  }, [
    fetchDashboardOverview,
    fetchEquipmentMetrics,
    fetchAccountCounts,
    fetchEquipmentStatus,
    fetchEquipmentFunctionality,
    fetchEquipmentByLocation,
    fetchSystemHealth
  ]);

  // refresh specific data section
  const refreshData = useCallback(async (section) => {
    setLoading(true);
    try {
      switch (section) {
        case 'overview':
          await fetchDashboardOverview();
          break;
        case 'equipment':
          await Promise.allSettled([
            fetchEquipmentMetrics(),
            fetchEquipmentStatus({ chart_type: 'pie' }),
            fetchEquipmentFunctionality(),
            fetchEquipmentByLocation({ chart_type: 'bar' })
          ]);
          break;
        case 'accounts':
          await fetchAccountCounts({ group_by: 'status' });
          break;
        case 'system':
          await fetchSystemHealth();
          break;
        default:
          await fetchAllDashboardData();
      }
    } finally {
      setLoading(false);
    }
  }, [
    fetchDashboardOverview,
    fetchEquipmentMetrics,
    fetchAccountCounts,
    fetchEquipmentStatus,
    fetchEquipmentFunctionality,
    fetchEquipmentByLocation,
    fetchSystemHealth,
    fetchAllDashboardData
  ]);

  // auto-fetch data on mount
  useEffect(() => {
    fetchAllDashboardData();
  }, [fetchAllDashboardData]);

  return {
    loading,
    dashboardData,
    fetchDashboardOverview,
    fetchEquipmentMetrics,
    fetchAccountCounts,
    fetchEquipmentStatus,
    fetchEquipmentFunctionality,
    fetchEquipmentByLocation,
    fetchSystemHealth,
    fetchAllDashboardData,
    refreshData
  };
};
