<h1 align="center">@stackup/codegen</h1>

<div align="center">

![Build](https://github.com/rzane/codegen/workflows/CI/badge.svg)
![Version](https://img.shields.io/npm/v/@stackup/codegen)
![License](https://img.shields.io/npm/l/@stackup/codegen)

</div>

A zero-config CLI tool to generate GraphQL type definitions and React Hooks. It's a thin wrapper around [GraphQL code generator](https://graphql-code-generator.com/).

## Install

    $ yarn add @stackup/codegen --dev
    $ yarn codegen --help
    Usage: codegen [ROOT] [options]

    Generate type definitions from GraphQL queries.

    Options:
      -s, --schema <SCHEMA>  URL or file path to a GraphQL schema
      --suffix               append suffix (e.g. Mutation, Query)
      --immutable            generate readonly types
      -v, --version          output the version number
      -h, --help             display help for command

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
        index.ts       <- This module exports a bunch of typed React Hooks
        schema.graphql <- This file contains your GraphQL schema
        posts.graphql
        users.graphql
