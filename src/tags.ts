import fetch from 'node-fetch'
import * as core from '@actions/core'

interface Registry {
  domain: string
  token: string
}

interface Target {
  repository: string
  tag: string
}

export interface Image {
  registry: Registry
  target: Target
}

interface Result {
  tag: string
  success: boolean
}

export async function addTags(image: Image, tags: string[]): Promise<Result[]> {
  const manifestTypes = [
    'docker.distribution.manifest.v1',
    'docker.distribution.manifest.v2',
    'docker.distribution.manifest.list.v2',
    'oci.image.manifest.v1',
    'oci.image.index.v1'
  ]

  const headers = {
    authorization: `Bearer ${image.registry.token}`,
    accept: manifestTypes.map(type => `application/vnd.${type}+json`).join(',')
  }

  const manifest = await fetch(manifestUrl(image, image.target.tag), {
    method: 'GET',
    headers
  })

  if (manifest.status !== 200) {
    core.debug(await manifest.json())
    throw new Error(`${image.target.repository}:${image.target.tag} not found.`)
  }

  const mediaType = manifest.headers.get('Content-Type')
  const targetManifest = await manifest.text()

  Object.assign(headers, {
    'Content-Type': mediaType
  })

  return await Promise.all(
    tags.map(async function (tag: string): Promise<Result> {
      const result = await fetch(manifestUrl(image, tag), {
        method: 'PUT',
        headers,
        body: targetManifest
      })

      if (result.status !== 201) {
        core.debug(await result.json())
      }

      return {tag, success: result.status === 201}
    })
  )
}

function manifestUrl(image: Image, tag: string): string {
  return `https://${image.registry.domain}/v2/${image.target.repository}/manifests/${tag}`
}
