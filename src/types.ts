/**
 * Registry
 */
export interface Registry {
  /**
   * Domain
   *
   * @type {string}
   */
  domain: string

  /**
   * Token
   *
   * @type {string}
   */
  token: string
}

/**
 * Target
 */
export interface Target {
  /**
   * Repository
   *
   * @type {string}
   */
  repository: string

  /**
   * Tag
   *
   * @type {string}
   */
  tag: string
}

/**
 * Image
 */
export interface Image {
  /**
   * Registry
   *
   * @type {Registry}
   */
  registry: Registry

  /**
   * Target
   *
   * @type {Target}
   */
  target: Target
}

/**
 * Result
 */
export interface Result {
  /**
   * Tag
   *
   * @type {string}
   */
  tag: string

  /**
   * Success
   *
   * @type {boolean}
   */
  success: boolean
}
