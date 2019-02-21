#!/usr/bin/env bash

set -e

ROOT_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/"

source "$ROOT_PATH/apps/git-utils/subrepo.sh"

echo "> Pulling and update all subrepos"
subrepoUpdate https://github.com/yehonal/sequelize-graphql-schema develop clean deps/sequelize-graphql-schema/
