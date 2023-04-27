export type Json =
  | string
  | number
  | boolean
  | null
  | { [property: string]: Json }
  | Json[];
