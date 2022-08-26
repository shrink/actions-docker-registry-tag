# Update Docker Registry Tag

A GitHub Action for adding many tags to an existing image in a Docker Registry
_without_ changing the digest, using Docker Registry API V2.

```yaml
- uses: shrink/update-registry-tag@v1
  with:
    registry: ghcr.io
    repository: ${{ github.repository }}
    target: sha-${{ github.sha }}
    tags: |
      v1.0.0
      latest
```

## Inputs

Token is an optional input for GitHub's Container Registry. Ensure the Actions
token has permission to write to the package repository by granting access as
described in ["About GitHub Packages with GitHub Actions"][docs/package-access].

| ID               | Description                                          | Examples                    |
| ---------------- | ---------------------------------------------------- | --------------------------- |
| **`registry`**   | **Registry API root domain**                         | `ghcr.io` `index.docker.io` |
| `token`          | Bearer token for the Registry API                    | `${{ secrets.DOCKER_KEY }}` |
| **`repository`** | **Image repository name**                            | `shrink/example`            |
| **`target`**     | **Tag of the existing image**                        | `branch-name` `sha-1150f2f` |
| **`tags`**       | **Tag(s) to add to the target (new-line delimited)** | `v1.0.1` `latest`           |

## Outputs

No outputs.

## Examples

### Tag Image with Semantic Version

Add Semantic Version tag to a commit's image in registry when a new tag is
pushed to the repository. The target image is assumed to have been tagged with
`sha-${{ github.sha }}` on build.

```yaml
name: Tag Image With Version

on:
  push:
    tags:
      - 'v*.*.*'

jobs:
  add-version-tag:
    runs-on: ubuntu-latest
    steps:
      - id: version
        uses: battila7/get-version-action@v2
      - name: Add Semantic Version tag to Docker Image
        uses: shrink/actions-docker-registry-tag@v1
        with:
          registry: ghcr.io
          repository: '${{ github.repository }}'
          target: 'sha-${{ github.sha }}'
          tags: '${{ steps.version.outputs.version }}'
```
