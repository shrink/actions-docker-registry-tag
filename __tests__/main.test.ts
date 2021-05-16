import {addTags} from '../src/tags'
import * as os from 'os'

jest.mock('../src/tags', () => {
  return {
    addTags: jest.fn()
  }
})

describe('action', () => {
  beforeEach(() => {
    process.stdout.write = jest.fn()
  })

  test('passes action parameters to tag adder', async () => {
    process.env['INPUT_REGISTRY'] = 'registry.example.com'
    process.env['INPUT_TOKEN'] = 'example-token'
    process.env['INPUT_REPOSITORY'] = 'examples'
    process.env['INPUT_TARGET'] = 'image'
    process.env['INPUT_TAGS'] = 'x\ny\nz'
    ;(addTags as jest.MockedFunction<any>).mockReturnValueOnce({
      success: true,
      tags: ['x', 'y', 'z']
    })

    await require('../src/main')

    const expectedImageParameters = {
      registry: {
        domain: 'registry.example.com',
        token: 'example-token'
      },
      target: {
        repository: 'examples',
        tag: 'image'
      }
    }

    expect(addTags).toHaveBeenCalledWith(expectedImageParameters, [
      'x',
      'y',
      'z'
    ])

    assertOutputSet('success', true)
    assertOutputSet('tags', 'x,y,z')
  })
})

function assertOutputSet(name: string, value: string | boolean): void {
  expect(process.stdout.write).toHaveBeenCalledWith(
    `::set-output name=${name}::${value}${os.EOL}`
  )
}
