#!/usr/bin/env python3

import asyncio
import websockets
import threading
import time
import random
import datetime as datetime
import cv2
import numpy as np
import json

async def send(client, data):
    await client.send(data)

async def handler(client, path):
    # Register.
    print("Websocket Client Connected.", client)
    clients.append(client)
    while True:
        try:
            print("ping", client)
            pong_waiter = await client.ping()
            await pong_waiter
            print("pong", client)
            time.sleep(3)
        except Exception as e:
            clients.remove(client)
            print("Websocket Client Disconnected", client)
            break

clients = []
start_server = websockets.serve(handler, "localhost", 5555)

asyncio.get_event_loop().run_until_complete(start_server)
threading.Thread(target = asyncio.get_event_loop().run_forever).start()

print("Socket Server Running. Starting main loop.")

cap = cv2.VideoCapture('http://212.96.97.68:8080/lenpl/index.m3u8')
frame_width = int( cap.get(cv2.CAP_PROP_FRAME_WIDTH))

frame_height =int( cap.get( cv2.CAP_PROP_FRAME_HEIGHT))

ret, frame1 = cap.read()
ret, frame2 = cap.read()
print(frame1.shape)
while cap.isOpened():
  diff = cv2.absdiff(frame1, frame2)
  gray = cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY)
  blur = cv2.GaussianBlur(gray, (5,5), 0)
  _, thresh = cv2.threshold(blur, 20, 255, cv2.THRESH_BINARY)
  dilated = cv2.dilate(thresh, None, iterations=3)
  contours, _ = cv2.findContours(dilated, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
  people = 0
  points = []
  for contour in contours:
      (x, y, w, h) = cv2.boundingRect(contour)

      if cv2.contourArea(contour) < 200:
          continue
      cv2.rectangle(frame1, (x, y), (x+w, y+h), (0, 255, 0), 2)
      people += 1
      points.append([x, y])
      cv2.putText(frame1, "Status: {}".format('Movement'), (10, 20), cv2.FONT_HERSHEY_SIMPLEX,
                  1, (0, 0, 255), 3)
  # cv2.drawContours(frame1, contours, -1, (0, 255, 0), 2)
  print("People: "+str(people))
  image = cv2.resize(frame1, (1280,720))
  # out.write(image)
  cv2.imshow("feed", frame1)
  frame1 = frame2
  ret, frame2 = cap.read()

  data = points
  message_clients = clients.copy()
  for client in message_clients:
      print("Sending", data, "to", client)
      try:
          asyncio.run(send(client, json.dumps(data)))
      except:
          # Clients might have disconnected during the messaging process,
          # just ignore that, they will have been removed already.
          pass

  if cv2.waitKey(40) == 27:
      break