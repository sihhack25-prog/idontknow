export interface User {
  id: string;
  email: string;
  role: 'technician' | 'government';
  name: string;
  campus?: string;
}

export interface EnergyData {
  solar: number;
  wind: number;
  battery: {
    charge: number;
    health: number;
    cycles: number;
  };
  load: number;
  grid: number;
  timestamp: Date;
}

export interface Alert {
  id: string;
  type: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface Campus {
  id: string;
  name: string;
  renewableUtilization: number;
  gridDependency: number;
  carbonSavings: number;
  energyData: EnergyData;
}

export interface KPI {
  renewableUtilization: number;
  gridDependency: number;
  carbonSavings: number;
  costReduction: number;
}