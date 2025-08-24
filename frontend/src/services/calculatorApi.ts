const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://calculator-backend.onrender.com/api/calculator'
  : 'http://localhost:5231/api/calculator';

export interface CalculationRequest {
  expression: string;
  angleMode: 'deg' | 'rad' | 'grad';
}

export interface CalculationResponse {
  success: boolean;
  result?: number;
  error?: string;
}

export interface FunctionRequest {
  function: string;
  value: number;
  angleMode: 'deg' | 'rad' | 'grad';
}

export interface MemoryRequest {
  action: string; // 'MS', 'MR', 'MC', 'M+', 'M-'
  slot: string;
  value?: number;
}

export interface MemoryResponse {
  success: boolean;
  memory: { [key: string]: number };
  error?: string;
}

export interface UnitConversionRequest {
  category: string;
  fromUnit: string;
  toUnit: string;
  value: number;
}

export interface UnitConversionResponse {
  success: boolean;
  result: number;
  error?: string;
}

class CalculatorApi {
  private async fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string; timestamp: string }> {
    return this.fetchApi('/health');
  }

  // Calculate expression
  async calculateExpression(request: CalculationRequest): Promise<CalculationResponse> {
    return this.fetchApi('/calculate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Calculate function
  async calculateFunction(request: FunctionRequest): Promise<CalculationResponse> {
    return this.fetchApi('/function', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Memory operations
  async memoryOperation(request: MemoryRequest): Promise<MemoryResponse> {
    return this.fetchApi('/memory', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Unit conversion
  async convertUnit(request: UnitConversionRequest): Promise<UnitConversionResponse> {
    return this.fetchApi('/convert', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Get constants
  async getConstants(): Promise<{ [key: string]: number }> {
    return this.fetchApi('/constants');
  }
}

export const calculatorApi = new CalculatorApi();