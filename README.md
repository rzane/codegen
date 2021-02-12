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

      -c, --client <react-query|react-apollo> (default: react-apollo)
        The preferred GraphQL client.

      --suffix
        Append a suffix to operations (e.g. usePersonQuery). This
        is helpful for avoiding naming collisions.

      --immutable
        Generate readonly types.

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

## Colocated Queries

What if you want your queries to live next to your components?

    src/
      components/
        User/
          User.tsx
          queries.graphql

Run the code generator:

    $ yarn codegen src --schema http://localhost:3000/graphql

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

## Supported Clients

#### [`react-apollo`](https://www.apollographql.com/docs/react/)

This is the default client. It'll just work out of the box.

#### [`react-query`](https://github.com/tannerlinsley/react-query)

To generate code for use with `react-query`, you'll need to run the command with `--client react-query`.

This will also create a file `client.ts` if it does not exist. You should feel free to edit this file.
