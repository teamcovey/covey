## Git Workflow

### Development Worklow

1. **LOCAL** || git status -> make sure you are on master
1. **LOCAL** || git pull --rebase upstream master -> makes sure master is up to date with truth
1. **LOCAL** || git checkout -b feature-branch
1. **LOCAL** || git status -> to check branch
1. Cyclical
  2. make edits
  3. git add
  4. git commit
  5. npm test
1. **LOCAL** || git pull --rebase upstream master
1. **LOCAL** || git push origin feature-branch
1. **GITHUB** || pull request
1. **GITHUB** || fill out pull request comment field
1. *IF MAKING Changes to pull request*
  1. **LOCAL** || make changes locally
  1. **LOCAL** || git add
  1. **LOCAL** || git commit
  1. **LOCAL** || git pull --rebase upstream master
  1. **LOCAL** || git push origin feature-branch


### Scrum master / second set of eyes
1. review changes and merge
1. merge request
