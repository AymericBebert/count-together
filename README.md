# CountTogether

Count together the scores on your card or board games!

## Installation

```shell
npm install
```

## Development server

Run `npm run start` for a dev server. Navigate to `http://localhost:4500/`. The app will automatically reload if you change any of the source files.

## Build and publish a new version

We use GitHub Actions to build the new version on release.

In order to build a new version, you need to create a new release on GitHub, using semver tags.

## Running unit tests

```bash
npm run test
```

## Run as static website

```bash
npm run build:serve
```

## Analyse bundle size

```bash
npm run build:stats
```

Then import your `dist/count-together/stats.json` file on [esbuild Bundle Size Analyzer](https://esbuild.github.io/analyze/)
