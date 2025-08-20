import "dotenv/config";

export interface IAppConfig {
    env: "dev" | "prod";
    port: string;
    bot_auth_token: string;
    worker_auth_token: string;
}

const getEnv = <T>(key: string, parser?: (value: string) => T): T => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Отсутствует в .env: ${key}`);
    }
    if (parser) {
        return parser(value);
    }
    return value as T;
};

export const config: IAppConfig = {
    env: getEnv("NODE_ENV"),
    port: getEnv("PORT"),
    bot_auth_token: getEnv("BOT_AUTH_TOKEN"),
    worker_auth_token: getEnv("WORKER_AUTH_TOKEN")
};
