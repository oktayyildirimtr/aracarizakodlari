export interface IndexingConfig {
  noindex: boolean;
  sitemapInclude: boolean;
}

export function configFromFaultCode(noindex: number, sitemapInclude: number): IndexingConfig {
  return {
    noindex: !!noindex,
    sitemapInclude: !!sitemapInclude,
  };
}
