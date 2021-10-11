# Docker Registry Tag

A GitHub Action for adding many tags to an existing image in a Docker Registry
_without_ changing the digest, using Docker Registry API V2.

```yaml
- uses: shrink/actions-docker-registry-tag@v2
  with:
    registry: ghcr.io
    repository: ${{ github.repository }}
    target: sha-${{ github.sha }}
    tags: |
      v1.0.0
      latest
```

:package: [Automatic Release Packaging](#automatic-release-packaging) is used by
this action, please reference by tag or commit hash in your Workflows.

## Inputs

Token is an optional input for GitHub's Container Registry. Ensure the token has
permission to write by granting Access as described in
["About GitHub Packages with GitHub Actions"][docs/package-access].

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

## Automatic Release Packaging

Packaging (creation of `dist`) happens automatically when a new tag is created.
Any reference to this Action in a Workflow must use a [tag][tags] (mutable) or
the commit hash of a tag (immutable).

```yaml
✅ uses: shrink/actions-docker-registry-tag@v1
✅ uses: shrink/actions-docker-registry-tag@v1.0.0
✅ uses: shrink/actions-docker-registry-tag@d5a9dba6524b17757be591ad59a518dd28419f62
❌ uses: shrink/actions-docker-registry-tag@main
```

The blog post
[Package GitHub Actions automatically with GitHub Actions][blog/package-automatically]
describes how this achieved.

[battila7/get-version-action]: https://github.com/battila7/get-version-action
[examples]: #examples
[blog/package-automatically]: https://medium.com/prompt/package-github-actions-automatically-with-github-actions-a70b9f7bae4
[tags]: https://github.com/shrink/actions-docker-registry-tag/tags
[docs/package-access]: https://docs.github.com/en/packages/managing-github-packages-using-github-actions-workflows/publishing-and-installing-a-package-with-github-actions#upgrading-a-workflow-that-accesses-ghcrio
