$:.unshift File.expand_path("/", __FILE__)
require 'rubygems'
require 'sinatra'

require 'faye/websocket'
require 'json'

require_relative 'index.rb'
require_relative 'server.rb'

Faye::WebSocket.load_adapter('thin')

use Backend

run Sinatra::Application

# Thin::Server.start '0.0.0.0', $PORT
