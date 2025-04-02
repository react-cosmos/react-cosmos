import { vi } from 'vitest';

vi.mock('os', () => ({
  networkInterfaces: vitest.fn(() => ({
    en0: [
      {
        address: '192.168.1.10',
        netmask: '255.255.255.0',
        family: 'IPv4',
        mac: '00:00:00:00:00:00',
        internal: false,
        cidr: '192.168.1.10/24',
      },
    ],
  })),
}));
