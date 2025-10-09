import { axiosClient } from './api.js';

class ApiService {
  constructor() {
    this.baseURL = import.meta.env.VITE_TARGET_SYSTEM || 'http://localhost:5002';
  }

  // helper method to handle API responses consistently
  async handleRequest(requestFn) {
    try {
      const response = await requestFn();
      return {
        success: true,
        data: response.data?.data || response.data,
        message: response.data?.msg || 'Success'
      };
    } catch (error) {
      console.error('API Request Error:', error);

      const errorMessage = error.response?.data?.msg ||
        error.response?.data?.error ||
        error.message ||
        'An unexpected error occurred';

      return {
        success: false,
        error: errorMessage,
        status: error.response?.status,
        data: null
      };
    }
  }

  // ACCOUNT MANAGEMENT

  async getAccounts(params = {}) {
    return this.handleRequest(() =>
      axiosClient.get(`${this.baseURL}/accounts/`, { params })
    );
  }

  async getAccount(id) {
    return this.handleRequest(() =>
      axiosClient.get(`${this.baseURL}/accounts/${id}`)
    );
  }

  async getCurrentAccount() {
    return this.handleRequest(() =>
      axiosClient.get(`${this.baseURL}/accounts/me`)
    );
  }

  async createAccount(accountData) {
    return this.handleRequest(() =>
      axiosClient.post(`${this.baseURL}/accounts/`, accountData)
    );
  }

  async updateAccount(id, accountData) {
    const url = id ? `${this.baseURL}/accounts/${id}` : `${this.baseURL}/accounts/`;
    return this.handleRequest(() =>
      axiosClient.put(url, accountData)
    );
  }

  async deleteAccount(id) {
    return this.handleRequest(() =>
      axiosClient.delete(`${this.baseURL}/accounts/${id}`)
    );
  }

  async getAccountRoles(params = {}) {
    return this.handleRequest(() =>
      axiosClient.get(`${this.baseURL}/account_roles/`, { params })
    );
  }

  async createAccountRole(roleData) {
    return this.handleRequest(() =>
      axiosClient.post(`${this.baseURL}/account_roles/`, roleData)
    );
  }

  async updateAccountRole(id, roleData) {
    return this.handleRequest(() =>
      axiosClient.put(`${this.baseURL}/account_roles/${id}`, roleData)
    );
  }

  async deleteAccountRole(id) {
    return this.handleRequest(() =>
      axiosClient.delete(`${this.baseURL}/account_roles/${id}`)
    );
  }

// LOCATIONS

  async getLocations(params = {}) {
    return this.handleRequest(() =>
      axiosClient.get(`${this.baseURL}/locations/`, { params })
    );
  }

  async createLocation(locationData) {
    return this.handleRequest(() =>
      axiosClient.post(`${this.baseURL}/locations/`, locationData)
    );
  }

  async updateLocation(id, locationData) {
    return this.handleRequest(() =>
      axiosClient.put(`${this.baseURL}/locations/${id}`, locationData)
    );
  }

  async deleteLocation(id) {
    return this.handleRequest(() =>
      axiosClient.delete(`${this.baseURL}/locations/${id}`)
    );
  }

  // EQUIPMENT SETS

  async getEquipmentSets(params = {}) {
    return this.handleRequest(() =>
      axiosClient.get(`${this.baseURL}/equipment_sets/`, { params })
    );
  }

  async createEquipmentSet(equipmentData) {
    return this.handleRequest(() =>
      axiosClient.post(`${this.baseURL}/equipment_sets/`, equipmentData)
    );
  }

  async updateEquipmentSet(id, equipmentData) {
    return this.handleRequest(() =>
      axiosClient.put(`${this.baseURL}/equipment_sets/${id}`, equipmentData)
    );
  }

  async deleteEquipmentSet(id) {
    return this.handleRequest(() =>
      axiosClient.delete(`${this.baseURL}/equipment_sets/${id}`)
    );
  }

  // EQUIPMENT SET COMPONENTS

  async getEquipmentSetComponents(id) {
    return this.handleRequest(() =>
      axiosClient.get(`${this.baseURL}/equipment_set_components/${id}`)
    );
  }

  async updateEquipmentSetComponents(id, componentsData) {
    return this.handleRequest(() =>
      axiosClient.put(`${this.baseURL}/equipment_set_components/${id}`, componentsData)
    );
  }

  // ANALYTICS

  async getDashboardOverview() {
    return this.handleRequest(() =>
      axiosClient.get(`${this.baseURL}/analytics/overview/dashboard`)
    );
  }

  async getEquipmentDashboardMetrics() {
    return this.handleRequest(() =>
      axiosClient.get(`${this.baseURL}/analytics/equipment/dashboard-metrics`)
    );
  }

  async getAccountCounts(params = {}) {
    return this.handleRequest(() =>
      axiosClient.get(`${this.baseURL}/analytics/accounts/counts`, { params })
    );
  }

  async getEquipmentStatus(params = {}) {
    return this.handleRequest(() =>
      axiosClient.get(`${this.baseURL}/analytics/equipment/status`, { params })
    );
  }

  async getEquipmentFunctionality(params = {}) {
    return this.handleRequest(() =>
      axiosClient.get(`${this.baseURL}/analytics/equipment/functionality`, { params })
    );
  }

  async getEquipmentByLocation(params = {}) {
    return this.handleRequest(() =>
      axiosClient.get(`${this.baseURL}/analytics/equipment/by-location`, { params })
    );
  }

  async getAccountActivity(params = {}) {
    return this.handleRequest(() =>
      axiosClient.get(`${this.baseURL}/analytics/accounts/activity`, { params })
    );
  }

  async getSystemHealth() {
    return this.handleRequest(() =>
      axiosClient.get(`${this.baseURL}/analytics/overview/system-health`)
    );
  }


  // ACCOUNT SETTINGS

  async getAccountSettings() {
    return this.handleRequest(() =>
      axiosClient.get(`${this.baseURL}/account_settings/`)
    );
  }

  async updateAccountSettings(settingsData) {
    return this.handleRequest(() =>
      axiosClient.put(`${this.baseURL}/account_settings/`, settingsData)
    );
  }




  // LOGS

  async getAccountLogs(params = {}) {
    return this.handleRequest(() =>
      axiosClient.get(`${this.baseURL}/account_logs/`, { params })
    );
  }

  async getEquipmentSetHistory(params = {}) {
    return this.handleRequest(() =>
      axiosClient.get(`${this.baseURL}/equipment_set_history/`, { params })
    );
  }

  // ACCESS LEVELS

  async getAccessLevels(params = {}) {
    return this.handleRequest(() =>
      axiosClient.get(`${this.baseURL}/access_levels/`, { params })
    );
  }
}

// export instance
export const apiService = new ApiService();
export default apiService;
