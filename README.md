![Covey](https://raw.githubusercontent.com/teamcovey/covey/master/client/styles/assets/coveyLogo-blue-white-04-01.png)

#### Covey is an interactive tool that simplifies group trip organization.
Collaborate with your friends to share rides, supplies, and expenses.

Please visit [mycovey.com](http://mycovey.com)

[![Build Status](https://travis-ci.org/teamcovey/covey.svg?branch=master)](https://travis-ci.org/teamcovey/covey)
--------------------


## Table of Contents 
- [Example / Usage](#example--usage)
- [Installation](#installation)
- [Architecture](#architecture)
  - [High Level Architecture](#high-level-architecture)
  - [Database Schema](#database-schema)
- [API Endpoints](#api)
- [Contributing](#contributing)
- [Questions and Issues](#questions-and-issues)
- [Meta](#meta)

## Example / Usage

![Screencapture](https://raw.githubusercontent.com/teamcovey/covey/master/client/styles/assets/covey1.gif)

## Installation
**Follow these steps to get a local version of Covey on your machine**

* Make sure Postgres is installed and running on your machine. We recommend using the [Postgres app](http://postgresapp.com/). 
* We recommend using Node.js v6.x.

Next, install all client and server-side dependencies:
```
$ sudo npm install -g bower
$ bower install
$ npm install
```

Set local environment variable to LOCAL:

```
$ export covey_env=LOCAL
```

Create keys.js file local with your Facebook, Email and Twilio secret keys. See server/config/keys.example.js for an example.

**For testing**
```
$ npm test
```

You're good to go. Start the server with:
```
$ npm start
```


## Architecture
### High Level Architecture
![Architecture](https://raw.githubusercontent.com/teamcovey/covey/master/client/styles/assets/architecture-sml.gif)
### Database Schema
Postgres using Bookshelf and Knex.

![Schema](https://raw.githubusercontent.com/teamcovey/covey/master/client/styles/assets/updatedSchema.png)

## API Endpoints
**For API Documentation, please see the [ENDPOINTS.md](ENDPOINTS.md) file**

## Questions and Issues
- For any issues, please refer to [**our issues page**](https://github.com/teamcovey/covey/issues).
- Please direct any questions regarding Covey to [**our wiki page**](https://github.com/teamcovey/covey/wiki).

## Contributing

- Covey was built using waffle.io as the project organization tool.
- Please visit the [GITFLOW.MD](GITFLOW.md) for our workflow guidelines.
- Please use the [Airbnb ES6 styleguide](https://github.com/airbnb/javascript) for code-style reference. 

####Contributors:

[Sky Free](https://github.com/swfree) | [Toben Green](https://github.com/tobensg) | [Rahim Dharssi](https://github.com/rahimftd) | [Fred Ryder](https://github.com/fredryder)

Credits: flaticon.com

"Distributed under the MIT License."

