# Update Docker Registry Tag

A GitHub Action for adding many tags to an existing image in a Docker Registry using Docker Registry API V2.

## Inputs

| ID               | Description                                          | Examples                    |
| ---------------- | ---------------------------------------------------- | --------------------------- |
| **`registry`**   | **Registry API root domain**                         | `ghcr.io` `index.docker.io` |
| `token`          | Bearer token for the Registry API                    | `${{ secrets.DOCKER_KEY }}` |
| **`repository`** | **Image repository name**                            | `shrink/example`            |
| **`target`**     | **Tag of the existing image**                        | `branch-name` `sha-1150f2f` |
| **`tags`**       | **Tag(s) to add to the target (new-line delimited)** | `v1.0.1` `latest`           |

## Workflow Example

```yaml
- uses: Theia-Scientific//update-registry-tag@v1
  with:
    registry: ghcr.io
    token: ${{ secrets.GITHUB_TOKEN }}
    repository: ${{ github.repository }}
    target: sha-${{ github.sha }}
    tags: |
      v1.0.0
      latest
```
