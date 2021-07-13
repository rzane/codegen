<h1 align="center">@stackup/codegen</h1>

<div align="center">

![Build](https://github.com/rzane/codegen/workflows/Build/badge.svg)
![Version](https://img.shields.io/npm/v/@stackup/codegen)
![License](https://img.shields.io/npm/l/@stackup/codegen)

</div>

A zero-config CLI tool to generate GraphQL type definitions and React Hooks. It's a thin wrapper around [GraphQL code generator](https://graphql-code-generator.com/).

## Install

    $ yarn add @stackup/codegen --dev
    $ yarn codegen --help
    Usage: codegen [ROOT] [options]

    Generate type definitions from GraphQL queries.

    Arguments:
      ROOT (required)
        The directory where your GraphQL queries live.

    Options:
      -s, --schema <SCHEMA> (required)
        URL or file path to a GraphQL schema. This option will be overridden
        when the SCHEMA environment variable is set.

      --suffix
        Append a suffix to operations (e.g. usePersonQuery). This
        is helpful for avoiding naming collisions.

      --immutable
        Generate readonly types.

      --colocate <common path>
        Generate files adjacent to their GraphQL source.

      --show-config
        Show the generated configuration

      -v, --version
        Output the version number

      -h, --help
        Display this help information

## Usage

You have a directory of queries:

    src/
      queries/
        posts.graphql
        users.graphql

Run the code generator:

    $ yarn codegen src/queries --schema http://localhost:3000/graphql

Now, you have code!

    src/
      queries/
        index.ts       <- This module exports typed React Hooks
        schema.graphql <- This file contains your GraphQL schema
        posts.graphql
        users.graphql

Import the typed document node and use a query:

```typescript
import { useQuery } from "@apollo/client"
import { UserDocument } from "../queries";

useQuery(UserDocument);
```

## Colocated Queries

What if you want your queries to live next to your components?

    src/
      components/
        User/
          User.tsx
          queries.graphql

Run the code generator:

    $ yarn codegen src --colocate src/queries --schema http://localhost:3000/graphql

Now, your file tree should look like this:

    src/
      queries/
        index.ts       <- This module exports your schema's types
        schema.graphql <- This file contains your GraphQL schema
      components/
        User/
          User.tsx
          queries.graphql
          queries.ts   <- This module exports typed React hooks
