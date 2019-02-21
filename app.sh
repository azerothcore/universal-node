#!/usr/bin/env bash

set -e

echo "> Init and updating submodules..."
[ ! -d "apps/git-subrepo" ] && git submodule add https://github.com/ingydotnet/git-subrepo apps/git-subrepo
git submodule update --init apps/git-subrepo

ROOT_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/"

source "$ROOT_PATH/apps/git-subrepo/.rc"

echo "> Pulling and update all subrepos"
git subrepo clean deps/sequelize-graphql-schema/
git subrepo pull deps/sequelize-graphql-schema/
git subrepo push deps/sequelize-graphql-schema/ -s
git subrepo clean deps/sequelize-graphql-schema/