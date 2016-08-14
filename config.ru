$:.unshift File.expand_path("/", __FILE__)
require 'rubygems'
require 'sinatra'
require_relative 'index.rb'
run Sinatra::Application