interface Registry {
  domain: string
  token: string
}

interface Target {
  repository: string
  tag: string
}

interface Image {
  registry: Registry
  target: Target
}

interface Result {
  success: boolean
  tags: string[]
}

export function addTags(image: Image, tags: string[]): Result {
  return {
    success: true,
    tags
  }
}
