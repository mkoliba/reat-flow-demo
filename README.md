# Welcome to Remix & react-flow demo!

- 📖 [Remix docs](https://remix.run/docs)

## Getting Started

```shellscript
npm install
```

set up the environment variables:

```shellscript
cp .env.example .env
```

create database and run migrations:

```shellscript
npx prisma migrate dev;
npx prisma generate;
```

## Development

Run the dev server:

```shellscript
npm run dev
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.
