import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ApiVersion } from '@shopify/shopify-api';

interface GraphQLQueryParams {
  shop: string;
  accessToken: string;
  query: string;
  variables?: Record<string, any>;
}

export interface GraphQLResponse<T> {
  data: T;
  errors?: { message: string; locations?: any[]; path?: string[] }[];
  extensions?: Record<string, any>;
}

@Injectable()
export class ShopifyGraphqlService {
  private readonly logger = new Logger(ShopifyGraphqlService.name);

  async query<T>(option: GraphQLQueryParams): Promise<GraphQLResponse<T>> {
    // opt for querying Shopify's GraphQL API
    const apiVersion = ApiVersion.April26;
    const shopifyEndpoint = `https://${option.shop}/admin/api/${apiVersion}/graphql.json`;

    const response = await fetch(shopifyEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': option.accessToken,
      },
      body: JSON.stringify({
        query: option.query,
        variables: option.variables,
      }),
    });

    // Check if the response is ok
    if (!response.ok) {
      this.logger.log(
        `Error occurred while fetching GraphQL data from ${option.shop}`,
      );
      throw new InternalServerErrorException(
        `Shopify API Error: ${response.status}`,
      );
    }

    const result: GraphQLResponse<any> = await response.json();
    if (result.errors?.length) {
      const messages = result.errors.map((e) => e.message).join(', ');
      this.logger.error(
        `Shopify GraphQL errors for ${option.shop}: ${messages}`,
      );
      throw new InternalServerErrorException(
        `Shopify GraphQL error: ${messages}`,
      );
    }
    return result.data;
  }
}
