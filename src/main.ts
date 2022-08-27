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
      package: core.getInput('package'),
      target: core.getInput('target')
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
        `${image.target.package}:${image.target.target} tagged with ${result.tag}`
      )

      return
    }

    core.setFailed(
      `${image.target.package}:${image.target.target} could not be tagged with ${result.tag}`
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
