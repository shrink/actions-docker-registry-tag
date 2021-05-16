import * as core from '@actions/core'
import {addTags} from './tags'

export async function run(): Promise<void> {
  try {
    const image = {
      registry: {
        domain: core.getInput('registry'),
        token: core.getInput('token')
      },
      target: {
        repository: core.getInput('repository'),
        tag: core.getInput('target')
      }
    }

    const tags: string[] = core.getInput('tags').split('\n')

    const result = addTags(image, tags)

    core.setOutput('success', result.success.toString())
    core.setOutput('tags', result.tags.toString())
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
