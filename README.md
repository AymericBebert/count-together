# CountTogether

Count together the scores on your card or board games!

This is a monorepo containing both the frontend and the backend of the project.

## Structure

- [`frontend/`](./frontend) — the Angular web application
- [`backend/`](./backend) — the Node.js API backend

See each project's own `README.md` for installation, development and build instructions.

## Build and publish a new version

We use GitHub Actions to build the Docker images on release.

In order to build new versions, you need to create a new release on GitHub, using semver tags.
Pushing a tag builds and publishes both the frontend (`count-together`) and backend
(`count-together-backend`) Docker images.
