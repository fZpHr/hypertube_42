/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
//import type { HttpContext } from '@adonisjs/core/http'
import MoviesController from '#controllers/movies_controller'

// GET /api/movies
// GET /api/movies/:id
router.group(() => {
    router.get('/api/movies/popular', [MoviesController, 'popular'])

    router.get('/api/movies/:id', [MoviesController, 'getByTmdbById'])
        .where('id', {
            match: /^[0-9]+$/,
        })
    router.get('/api/movies/watch/:id', [MoviesController, 'watch'])

    router.get('/api/movies/:name', [MoviesController, 'search'])
        .where('name', {
            match: /^[a-zA-Z]+$/,
        })
})


// GET /api/users
// GET /api/users/:id
// PATCH /api/users/:id
// GET /api/comments
// GET /comments/:id
// PATCH /comments/:id
// DELETE /comments/:id
// POST /comments or POST /movies/:movie_id/comments

// GET /api/torrent/piratebay/:name