export interface DeviceTokenStorage {
  getToken(): Promise<string | null>;
  setToken(token: string): Promise<void>;
  clearToken(): Promise<void>;
}

let token: string | null = null;

export const memoryDeviceTokenStorage: DeviceTokenStorage = {
  async getToken() {
    return token;
  },
  async setToken(value) {
    token = value;
  },
  async clearToken() {
    token = null;
  },
};

export function createDeviceTokenStorage(
  adapter: DeviceTokenStorage,
): DeviceTokenStorage {
  return adapter;
}