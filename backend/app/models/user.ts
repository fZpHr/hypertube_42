import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import type { HasMany } from '@adonisjs/lucid/types/relations'

import Movie from './movie_user.js'


const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare username: string | null

  @column()
  declare email: string

  @column({ serializeAs: "N/A" })
  declare password: string

  @column()
  declare profile_picture: string;

  @column()
  declare first_name: string;

  @column()
  declare last_name: string;

  @column()
  declare role: string;

  @column()
  declare language: string;

  @column()
  declare nsfw: boolean;

  @hasMany(() => Movie)
  declare alreadyWatched: HasMany<typeof Movie>

  @column()
  declare auth_method: string;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column()
  declare reset_token: string | null

  @column.dateTime({ autoCreate: true })
  declare reset_token_expires: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User)
}