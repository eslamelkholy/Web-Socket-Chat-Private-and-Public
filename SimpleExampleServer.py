import signal
import sys
import ssl
from SimpleWebSocketServer import WebSocket, SimpleWebSocketServer, SimpleSSLWebSocketServer
from optparse import OptionParser
import json


users = []
onlineUsers = []
class ChatApplication(WebSocket):

   def handleMessage(self):
      
      msg = json.loads(self.data)
      if msg["type"] == "login":
         onlineUsers.append({"address" : self.address, "username" : msg["text"]})
      # Send To Client Side
      msg_to_send = self.get_client_message(msg)
      for user in users:
         user.sendMessage(msg_to_send)
         user.sendMessage(json.dumps({"type" : "connectedUsers", 'value' : onlineUsers}))


   def handleConnected(self):
      users.append(self)


   def handleClose(self):
      myobj = self
      users.remove(myobj)
      onlineUsers[:] = [d for d in onlineUsers if d["address"] != myobj.address]
      for user in users:
         user.sendMessage(json.dumps({"type" : "connectedUsers", 'value' : onlineUsers}))


   def get_client_message(self, message):
      if message["type"] == "login":
         text_to_send = json.dumps({"type" : "onlineUsers", 'value' : message['text']})
      if message["type"] == "chat":
         text_to_send = json.dumps({"type" : "chat", 'value' : message['text'], "sender" : message["sender"]})
      if message["type"] == "privateChat":
         text_to_send = json.dumps({"type" : "privateChat", 'value' : message['text'], "sender" : message["sender"], "targetUser" : message["targetUser"]})

      return text_to_send



server = SimpleWebSocketServer("", 8000, ChatApplication)
print("Server Listen On Port:8000")
test = [{"hello" : "eslam", "address" : 12213312}]
print(test[0]["hello"] + "=========================================")
server.serveforever()

# class SimpleChat(WebSocket):

#    def handleMessage(self):
#       for client in clients:
#          if client != self:
#             client.sendMessage(self.address[0] + u' - ' + self.data)

#    def handleConnected(self):
#       print (self.address, 'connected')
#       for client in clients:
#          client.sendMessage(self.address[0] + u' - connected')
#       clients.append(self)

#    def handleClose(self):
#       clients.remove(self)
#       print (self.address, 'closed')
#       for client in clients:
#          client.sendMessage(self.address[0] + u' - disconnected')


