# Update Docker Registry Tag

A GitHub Action for adding tags to an existing image in a Docker Registry using Docker Registry API V2.

## Inputs

| ID             | Description                                          | Examples                      |
| -------------- | ---------------------------------------------------- | ----------------------------- |
| **`registry`** | **Registry API root domain**                         | `ghcr.io`                     |
| `token`        | Bearer token for the Registry API                    | `${{ secrets.GITHUB_TOKEN }}` |
| **`package`**  | **Package name**                                     | `theia-scientific/example`    |
| **`target`**   | **Target tag**                                       | `latest`                      |
| **`tags`**     | **Tag(s) to add to the target (new-line delimited)** | `1.0.1`                       |

## Workflow Example

```yaml
- uses: Theia-Scientific/update-registry-tag@v1
  with:
    registry: ghcr.io
    token: ${{ secrets.GITHUB_TOKEN }}
    package: theia-scientific/example
    target: latest
    tags: 1.0.0
```
