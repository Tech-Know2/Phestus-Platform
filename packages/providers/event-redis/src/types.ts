export interface RedisEventProviderConfig {
    url: string;

    /**
     * Redis stream used for Phestus events.
     */
    stream?: string;

    /**
     * Consumer group used by this provider.
     */
    consumerGroup?: string;

    /**
     * Consumer name.
     */
    consumerName?: string;
}