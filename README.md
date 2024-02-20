# Red.dot - Nextjs Reddit Clone

![Home](/public/img/readme/home.png)

![Parallel](/public/img/readme/parallel.png)

![Community](/public/img/readme/community.png)

![Tree](/public/img/readme/tree.png)

## Features

- Authentication using Auth.js
- N level of nested comments using ltree type
- Customize community UI
  - Choose between background color or image, upload community avatar, etc
  - Join/Leave community
- Optimistic updates for a better user experience
- And more...

## Getting started

First, clone the project

```
git clone aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
```

and copy these environment variables into a .env file

```
AUTH_SECRET=
NEXTAUTH_URL=

DATABASE_URL=postgres[ql]://[username[:password]@][host[:port],]/database[?parameter_list]
```

replace `DATABASE_URL` with the respective uri.

## Database

### Docker

Create a postgres instance

```
docker run --name psql-reddot -e POSTGRES_PASSWORD=root -d postgres
```

### Prisma

Generate Prisma client

```
npx prisma generate
```

then copy the content of `init.sql` directly in to the postgres CLI

and that's all you need to get started!

## References

[Postgres hierarchical tree-like data type](https://www.postgresql.org/docs/current/ltree.html)
