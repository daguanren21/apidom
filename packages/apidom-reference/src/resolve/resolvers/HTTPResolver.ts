import Resolver, { ResolverOptions } from './Resolver.ts';
import * as url from '../../util/url.ts';
import File from '../../File.ts';

/**
 * @public
 */
export interface HTTPResolverOptions extends ResolverOptions {
  readonly timeout?: number;
  readonly redirects?: number;
  readonly withCredentials?: boolean;
}

/**
 * @public
 */
abstract class HTTPResolver extends Resolver {
  protected readonly timeout: number;

  protected readonly redirects: number;

  protected readonly withCredentials: boolean;

  constructor(options?: HTTPResolverOptions) {
    const {
      name = 'http-resolver',
      timeout = 5000,
      redirects = 5,
      withCredentials = false,
    } = options ?? {};

    super({ name });
    this.timeout = timeout;
    this.redirects = redirects;
    this.withCredentials = withCredentials;
  }

  // eslint-disable-next-line class-methods-use-this
  canRead(file: File): boolean {
    return url.isHttpUrl(file.uri);
  }

  abstract getHttpClient(): unknown;
}

export default HTTPResolver;
