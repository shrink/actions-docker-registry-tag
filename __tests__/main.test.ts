import {Image, addTags} from '../src/tags'

jest.mock('../src/tags', () => {
  return {
    addTags: jest.fn()
  }
})

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

describe('action', () => {
  beforeEach(() => {
    process.stdout.write = jest.fn()
  })

  test('passes action parameters to tag adder', async () => {
    setEnvFromImage(expectedImageParameters)
    process.env['INPUT_TAGS'] = 'x\ny\nz'
    ;(addTags as jest.MockedFunction<any>).mockReturnValueOnce([])

    await require('../src/main')

    expect(addTags).toHaveBeenCalledWith(expectedImageParameters, [
      'x',
      'y',
      'z'
    ])
  })
})

function setEnvFromImage(image: Image): void {
  process.env['INPUT_REGISTRY'] = image.registry.domain
  process.env['INPUT_TOKEN'] = image.registry.token
  process.env['INPUT_REPOSITORY'] = image.target.repository
  process.env['INPUT_TARGET'] = image.target.tag
}
