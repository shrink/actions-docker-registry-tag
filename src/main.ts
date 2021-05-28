import * as core from '@actions/core'
import {addTags} from './tags'

export async function run(): Promise<void> {
  try {
    let token = core.getInput('token')

    if (core.getInput('registry') === 'ghcr.io') {
      token = Buffer.from(token).toString('base64');
    }

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

    const tags: string[] = core.getInput('tags').split('\n')

    const results = await addTags(image, tags)

    for (const result of results) {
      if (result.success === true) {
        core.info(
          `${image.target.repository}:${image.target.tag} tagged with ${result.tag}`
        )
      }

      if (result.success === false) {
        core.setFailed(
          `${image.target.repository}:${image.target.tag} could not be tagged with ${result.tag}`
        )
      }
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
