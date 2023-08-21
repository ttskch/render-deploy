# Render Deploy

[![CI](https://github.com/ttskch/render-deploy/actions/workflows/ci.yaml/badge.svg)](https://github.com/ttskch/render-deploy/actions/workflows/ci.yaml)

The most simple and customizable GitHub Action to deploy a service to [Render.com](https://render.com/).

## Inputs

| Name | Description | Required | Default |
| --- | --- | --- | --- |
| `api-key` | Render.com API key | Yes | |
| `service-id` | ID of the service to deploy | Yes | |
| `interval` | Interval to check deploy status (sec) | | 10 |
| `timeout` | If deploy has not finished after this time, the action will fail (sec) | | 600 |

## Example usage

```yaml
name: Render Deploy

on:
  push:
  pull_request:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: ttskch/render-deploy@v1.0.0
        with:
          api-key: ${{ secrets.RENDER_API_KEY }}
          service-id: ${{ secrets.RENDER_SERVICE_ID }}
          interval: 20 # optional
          timeout: 300 # optional
```
