# CountTogether

Count together the scores on your card or board games!

## Installation

```shell
npm install
```

## Development server

Run `npm run start` for a dev server. Navigate to `http://localhost:4500/`. The app will automatically reload if you change any of the source files.

## Build and publish new version

We use GitHub Actions on tags to build the docker image

```shell
git tag 1.0.0
git push origin 1.0.0
```

## Running unit tests

```bash
npm run test
```

## Run as static website

```bash
npm run build:serve
```
