# Deploy action

Creates github deployment

```
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy-staging:
    steps:
      - uses: kolonialno/deploy-action
        with:
          environment: staging
          github-token: ${{ secrets.GITHUB_TOKEN }}
```