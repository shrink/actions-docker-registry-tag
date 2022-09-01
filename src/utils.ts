import fetch from 'node-fetch';
import * as core from '@actions/core';
import { Image, Result } from './types';

/**
 * Manifest URL
 */
const manifestUrl = (image: Image, tag: string): string => {
  const url = `https://${image.registry.domain}/v2/${image.target.package}/manifests/${tag}`
  console.log(`URL: ${url}`)

  return url
}

/**
 * Add Tags
 */
export const addTags = async (
  image: Image,
  tags: string[]
): Promise<Result[]> => {
  /**
   * Types
   */
  const manifestTypes = [
    'docker.distribution.manifest.v1',
    'docker.distribution.manifest.v2',
    'docker.distribution.manifest.list.v2',
    'oci.image.manifest.v1',
    'oci.image.index.v1'
  ]

  /**
   * Headers
   */
  const headers = {
    authorization: `Bearer ${image.registry.token}`,
    accept: manifestTypes.map(type => `application/vnd.${type}+json`).join(',')
  }

  /**
   * Manifest
   */
  const manifest = await fetch(manifestUrl(image, image.target.target), {
    method: 'GET',
    headers
  })

  /**
   * Check status
   */
  if (manifest.status !== 200) {
    core.debug((await manifest.json()) as string)
    throw new Error(`${image.target.package}:${image.target.target} not found.`)
  }

  const mediaType = manifest.headers.get('Content-Type')
  const targetManifest = await manifest.text()

  /**
   * Set Content-Type
   */
  Object.assign(headers, {
    'Content-Type': mediaType
  })

  /**
   * Add Tags
   */
  return await Promise.all(
    tags.map(async (tag: string): Promise<Result> => {
      /**
       * Remove `^v` at the beginning if tag is version
       */
      tag = tag.replace(/^v/, '')

      const result = await fetch(manifestUrl(image, tag), {
        method: 'PUT',
        headers,
        body: targetManifest
      })

      return {tag, success: result.status === 201}
    })
  )
}
