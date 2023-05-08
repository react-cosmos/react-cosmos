declare module 'next/navigation' {
  export function usePathname(): string;
  export function useRouter(): {
    push(href: string): void;
  };
}
