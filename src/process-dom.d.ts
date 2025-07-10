export declare function processDom(
  url: string,
  htmlOrDoc: string | Document | null,
  options?: {
    inline_title?: boolean;
    ignore_links?: boolean;
    improve_readability?: boolean;
    id?: string;
  }
): Promise<string>; 