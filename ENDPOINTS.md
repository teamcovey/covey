# API Endpoints

## Users

* POST /api/signup

* GET /api/user/:userId

* GET /api/username/:userId

* DELETE /api/user/:userId

* PUT /api/user/:userId

* GET /api/users/:coveyId

* GET /api/friends/:userId

* POST /api/friends/:userId/:friendId

* DELETE /api/friends/:userId/:friendId

## Authentication & sign-up

* GET /api/auth/facebook

* GET /api/auth/facebook/return

* GET /api/logout

## Coveys

* GET /api/coveys/:userId

* POST /api/coveys

* DELETE /api/coveys/:coveyId

* PUT /api/coveys/:coveyId

* GET /api/covey/:coveyId

* POST /api/coveys/:coveyId/:userId

* DELETE /api/coveys/:coveyId/:userId

## Rides

* POST /api/rides

* PUT /api/rides/:carId

* DELETE /api/rides/:coveyId/:carId

* GET /api/rides/:coveyId

* GET /api/riders/:carId

* DELETE /api/riders/:coveyId/:carId/:userId

* POST /api/riders/:carId/:userId

## Resources

* POST /api/resources

* PUT /api/resources/:resourceId

* DELETE /api/resources/:coveyId/:resourceId

* GET /api/resources/:coveyId

* GET /api/suppliers/:resourceId

* DELETE /api/suppliers/:coveyId/:resourceId/:userId

* POST /api/suppliers/:resourceId/:userId

## Expenses

* POST /api/expenses

* PUT /api/expenses/:expenseId

* DELETE /api/expenses/:coveyId/:expenseId

* GET /api/expenses/:coveyId

* GET /api/expenses/participants/:expenseId

* DELETE /api/expenses/participants/:coveyId/:expenseId/:userId

* POST /api/expenses/participants/:expenseId/:userId

## Phone number verification

* GET /api/searchUsers/:searchVal

* GET /api/tel/verify/:tel

* POST /api/tel routeTel.addTel

* GET /api/tel routeTel.hasTel

## Email

* POST /api/email/:coveyId/:userId