'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

//https://unruffled-kilby-8e1c19.netlify.app
//http://127.0.0.1:8080
//https://sorosoke.com.ng

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})

Route.group(() => {

  Route.get('check/session', 'AuthenticateController.checkSession').formats(['json']); //Check if the users token is valid

  Route.get('twitter/auth/url', 'AuthenticateController.generateTwitterAuthUrl').formats(['json']); //Twitter Generate Auth Url

  Route.get('twitter/auth/callback', 'AuthenticateController.storeUser').formats(['json']); //Twitter Fetch USer Data and Generate auth Token

  Route.get('feeds/:page', 'FeedController.fetchFeeds').middleware(['auth:jwt']).formats(['json'])

  Route.post('create/feed', 'FeedController.createFeed').validator('CreateFeed').middleware(['auth:jwt']).formats(['json'])


}).prefix('api/v1')