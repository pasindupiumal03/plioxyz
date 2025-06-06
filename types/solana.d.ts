// Type definitions for Phantom wallet injection
declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{
        publicKey: {
          toString: () => string;
        };
      }>;
      disconnect: () => Promise<void>;
    };
  }
}

export {}; // This file needs to be a module
