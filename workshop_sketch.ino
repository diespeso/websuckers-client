#include "WiFi.h"
#include <ArduinoWebsockets.h>
#include <ArduinoJson.h>

const char* SSID = "INFINITUMx5e2";
const char* PASSWORD = "078603d626";
const char* SERVER = "http://192.168.1.75:443";
const char* SECRET = "SECRETSTRING";

const int GPIO_OUT = 26;
const int GPIO_FOTO_IN = 35;

String id = "";
int lightLevel = 0;

using namespace websockets;
WebsocketsClient client;

void onEventCallback(WebsocketsEvent event, String data) {
  if (event == WebsocketsEvent::ConnectionOpened) {
    Serial.printf("Connection opened to %s\n", SERVER);
  } else if (event == WebsocketsEvent::ConnectionClosed) {
    Serial.println("Connection closed");
  } else if (event == WebsocketsEvent::GotPing) {
    Serial.println("got a ping");
  } else {
    Serial.println("got a pong");
  }
}

void onMessageCallback(WebsocketsMessage message) {
  StaticJsonDocument<1024> document;

  deserializeJson(document, message.data());
  const char* messageType = document["messageType"].as<char*>();
  if (strcmp(messageType, "GRANT_IDENTIFIER") == 0) {
    id = String(document["id"].as<char*>());
    Serial.printf("This client is now known as %s by the server\n", id.c_str());
  }
}

String buildGreetingMessage() {
  DynamicJsonDocument json(1024);
  json["messageType"] = "GREET";
  json["secret"] = SECRET;

  String out;
  serializeJson(json, out);
  return out;
}

String buildBroadcastMessage(String message) {
  DynamicJsonDocument json(1024);
  json["id"] = id;
  json["messageType"] = "BROADCAST";
  json["broadcast"] = message;

  String out;
  serializeJson(json, out);
  Serial.printf("building broadcast with content '%s'...\n", message.c_str());
  return out;
}

void broadcastLightAlert() {
  client.send(buildBroadcastMessage("Too much light!"));
}

void setup() {
  Serial.begin(9600);
  pinMode(GPIO_OUT, OUTPUT);
  pinMode(GPIO_FOTO_IN, INPUT);
  WiFi.mode(WIFI_STA);
  delay(100);

  WiFi.begin(SSID, PASSWORD);
  while(WiFi.status() != WL_CONNECTED) {
    Serial.printf("trying to connect to %s...\n", SSID);
    delay(200);
  }
  IPAddress ipAddress = WiFi.localIP();
  Serial.printf("connected to %s newtwork with ip %d.%d.%d.%d\n",
    SSID, ipAddress[0], ipAddress[1], ipAddress[2], ipAddress[3]);

  client.onEvent(onEventCallback);
  client.onMessage(onMessageCallback);

  client.connect(SERVER);

  client.send(buildGreetingMessage());

  Serial.println("setup done.");
  delay(200);
}

void loop() {
  digitalWrite(GPIO_OUT, HIGH);
  if (!client.pong()) {
    client.connect(SERVER);
    Serial.println("reconexión");
  }
  client.poll();
  lightLevel = analogRead(GPIO_FOTO_IN);
  if (lightLevel > 1000) {
    broadcastLightAlert();
  }
  delay(200);
}
