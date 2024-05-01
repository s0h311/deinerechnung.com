import { Database } from '~/supabase/database.types'

export type Recipient = SnakeToCamelCaseNested<Database['public']['Tables']['recipient']['Row']>
export type InvoicePosition = SnakeToCamelCaseNested<Database['public']['Tables']['invoice_position']['Row']>
export type Sender = SnakeToCamelCaseNested<Database['public']['Tables']['sender']['Row']>
export type Subscription = SnakeToCamelCaseNested<Database['public']['Tables']['subscription']['Row']>

export type SenderAddress = Pick<Sender, 'addressLine' | 'zipCode' | 'city' | 'country'>

type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamelCase<U>>}`
  : S

export type SnakeToCamelCaseNested<T> = T extends object
  ? T extends (infer U)[]
    ? U extends object
      ? { [K in keyof U as SnakeToCamelCase<K & string>]: SnakeToCamelCaseNested<U[K]> }[]
      : T
    : {
        [K in keyof T as SnakeToCamelCase<K & string>]: SnakeToCamelCaseNested<T[K]>
      }
  : T
