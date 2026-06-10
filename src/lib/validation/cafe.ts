import { z } from 'zod'

const HoursSchema = z.record(
  z.enum(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']),
  z.object({ open: z.string(), close: z.string() }).nullable()
)

export const CafeCreateSchema = z.object({
  name:            z.string().min(2).max(120),
  address:         z.string().min(5).max(300),
  borough:         z.enum(['manhattan', 'brooklyn', 'queens', 'bronx', 'staten_island']),
  neighborhood:    z.string().max(80).nullable().optional(),
  lat:             z.number().min(40.4).max(40.95),
  lng:             z.number().min(-74.27).max(-73.68),
  wifi:            z.enum(['none', 'free', 'paid_or_login']),
  outlets:         z.enum(['none', 'few', 'plenty']),
  desk_size:       z.enum(['small', 'medium', 'large']),
  seats:           z.enum(['s_0_10', 's_10_20', 's_20_30', 's_30_plus']).nullable().optional(),
  hours:           HoursSchema.nullable().optional(),
  noise:           z.enum(['quiet', 'moderate', 'lively']).nullable().optional(),
  turnstile_token: z.string().min(1),
  honeypot:        z.literal(''),
})

// All data fields optional, anti-spam fields required
export const CafePatchSchema = CafeCreateSchema
  .omit({ turnstile_token: true, honeypot: true })
  .partial()
  .extend({
    turnstile_token: z.string().min(1),
    honeypot:        z.literal(''),
  })

export type CafeCreateInput = z.infer<typeof CafeCreateSchema>
export type CafePatchInput  = z.infer<typeof CafePatchSchema>
