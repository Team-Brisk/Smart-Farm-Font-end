declare module "mqtt/dist/mqtt.min" {
  export function connect(
    url: string,
    options?: import("mqtt").IClientOptions
  ): import("mqtt").MqttClient;
}
