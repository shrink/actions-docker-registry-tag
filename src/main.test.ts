import { Image } from './types';
import { addTags } from './utils';

/**
 * Utils
 */
jest.mock('./utils', () => {
  return {
    addTags: jest.fn()
  }
})

/**
 * Image
 */
const image: Image = {
  registry: {
    domain: 'registry.example.com',
    token: 'example-token'
  },
  target: {
    package: 'example',
    target: 'image'
  }
}

/**
 * Action
 */
describe('action', () => {
  beforeEach(() => {
    process.stdout.write = jest.fn()
  })

  test('passes action parameters to tag added', async () => {
    process.env['INPUT_REGISTRY'] = image.registry.domain
    process.env['INPUT_TOKEN'] = image.registry.token
    process.env['INPUT_PACKAGE'] = image.target.package
    process.env['INPUT_TARGET'] = image.target.target

    process.env['INPUT_TAGS'] = 'x\ny\nz'
    ;(addTags as jest.MockedFunction<any>).mockReturnValueOnce([])

    /**
     * Main
     */
    await require('./main')

    expect(addTags).toHaveBeenCalledWith(image, ['x', 'y', 'z'])
  })
})
