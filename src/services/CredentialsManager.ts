import { useState, useEffect } from 'react';

export interface ExchangeCredentials {
  id: string;
  name: string;
  exchange: string;
  apiKey: string;
  secretKey: string;
  additionalFields?: Record<string, string>;
}

export class CredentialsManager {
  private static readonly STORAGE_KEY = 'exchange_credentials';

  static saveCredentials(credentials: ExchangeCredentials): void {
    try {
      const existing = this.getCredentials();
      const updated = existing.filter(cred => cred.id !== credentials.id);
      updated.push(credentials);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save credentials:', error);
      throw new Error('Failed to save credentials');
    }
  }

  static getCredentials(): ExchangeCredentials[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to retrieve credentials:', error);
      return [];
    }
  }

  static deleteCredentials(id: string): void {
    try {
      const credentials = this.getCredentials();
      const updated = credentials.filter(cred => cred.id !== id);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to delete credentials:', error);
      throw new Error('Failed to delete credentials');
    }
  }
}