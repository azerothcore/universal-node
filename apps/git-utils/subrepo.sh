
source "../git-subrepo/.rc"

echo "> Init and updating submodules..."
[ ! -d "apps/git-subrepo" ] && git submodule add https://github.com/ingydotnet/git-subrepo apps/git-subrepo
git submodule update --init apps/git-subrepo

function subrepoUpdate() {
    repo=$1
    branch=$2
    folder=$3

    git subrepo init "$folder" -r "$repo" -b "$branch"
    git subrepo clean "$folder"
    git subrepo pull "$folder"
    git subrepo push "$folder" -s
    git subrepo clean "$folder"
}