Notes
---
The main magic numbers and requested features
are listed in `src/commonConfig.ts`
which also may be initialized using environment
variables in the future.

I allowed myself to have fun and build the reusable program
which code is much larger than requested. Hope you like the sugar =)

Installation
---
Run commands `yarn install` or `npm install`
or their shorthands.


Development
---
You can run source files from `./src` directory compiling it on the fly.
It requires the `ts-node` package which is listed in `devDependencies`.

**NPM**
* `npm run dev:client`
* `npm run dev:server`

**YARN**
* `yarn run dev:client`
* `yarn run dev:server`

Usage
===
that you will be able to prune the devDependencies
and run the distributable after the dependencies installation.
Your package manager will use the `postinstall` script to init the 
distributable building automatically.

**NPM**
* `npm i`
* `npm run start:client`
* `npm run start:server`

**YARN**
* `yarn`
* `yarn run start:client`
* `yarn run start:server`
