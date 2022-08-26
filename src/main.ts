import * as core from '@actions/core';
import { Result } from './types';
import { addTags } from './utils';

/**
 * Main
 */
const main = async (): Promise<void> => {
  let token = core.getInput('token')

  /**
   * GHCR
   */
  if (core.getInput('registry') === 'ghcr.io') {
    token = Buffer.from(token).toString('base64')
  }

  /**
   * Image
   */
  const image = {
    registry: {
      domain: core.getInput('registry'),
      token
    },
    target: {
      repository: core.getInput('repository'),
      tag: core.getInput('target')
    }
  }

  /**
   * Tags
   */
  const tags: string[] = core.getInput('tags').split('\n')

  /**
   * Add Tags
   */
  const results = await addTags(image, tags)

  /**
   * Check status
   */
  results.forEach((result: Result) => {
    if (result.success === true) {
      core.info(
        `${image.target.repository}:${image.target.tag} tagged with ${result.tag}`
      )

      return
    }

    core.setFailed(
      `${image.target.repository}:${image.target.tag} could not be tagged with ${result.tag}`
    )
  })
}

/**
 * Entry point
 */
try {
  main()
} catch (error: any) {
  core.setFailed(error.message)
}
