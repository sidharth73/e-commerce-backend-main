import vine from '@vinejs/vine'

export const registerSchema = vine.object({
  username: vine.string(),
  password: vine
    .string()
    .minLength(8)
    .maxLength(32)
    .confirmed()
})

export const loginSchema = vine.object({
  username: vine.string(),
  password: vine.string()
})
