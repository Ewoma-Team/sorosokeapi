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

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})

Route.get('test', 'WebhookController.trigger');
// Route.get('covid19/:country/:status', 'Covid19Controller.covid19CountryAndStatus')
Route.post('c19/make-me-better', 'Covid19Controller.makeMeBetter')
Route.post('c19/reachout', 'Covid19Controller.reachOut')