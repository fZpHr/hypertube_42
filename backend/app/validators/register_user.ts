import vine from '@vinejs/vine'

export const RegisterValidator = vine.compile(
    vine.object({
        username: vine.string().trim().minLength(2).maxLength(12).escape().unique({ table: 'users', column: 'username' }),
        email: vine.string().trim().minLength(6).email().escape().unique({ table: 'users', column: 'email' }),
        password: vine.string().trim().minLength(6).maxLength(30).escape()
    })
)

export const LoginValidator = vine.compile(
    vine.object({
        username: vine.string().trim().minLength(2).maxLength(12).escape(),
        password: vine.string().trim().minLength(6).maxLength(30).escape()
    })
)
