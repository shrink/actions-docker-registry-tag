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
   * Package
   *
   * @type {string}
   */
  package: string

  /**
   * Target
   *
   * @type {string}
   */
  target: string
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
