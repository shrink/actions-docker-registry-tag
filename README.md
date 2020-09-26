# Docker Registry Tag

A GitHub Action for adding many tags to an existing image in a Docker Registry
_without_ changing the digest, using Docker Registry API V2.

```yaml
- name: Tag Release
  uses: shrink/actions-docker-registry-tag@v1
  with:
    registry: ghcr.io
    token: ${{ secrets.GHCR_PAT }}
    repository: shrink/example
    target: sha-${{ github.sha }}
    tags: |
      v1.0.0
      latest
```

## Inputs

All inputs are required.

| ID  | Description | Examples |
| --- | ----------- | -------- |
| `registry` | Registry API root domain | `ghcr.io` `index.docker.io` |
| `token` | Bearer token for the Registry API | `${{ secrets.GHCR_PAT }}` |
| `repository` | Image repository name | `shrink/example` |
| `target` | Tag of the existing image | `branch-name` `sha-1150f2f` |
| `tags` | Tag(s) to add to the target (new-line delimited) | `v1.0.1` `latest` |

## Outputs

No outputs.
