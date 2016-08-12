require 'em-websocket'
require 'json'

$length = 30
$players_hash = {}

EM.run {

  def create_or_move_player(player_name)
    if !$players_hash.include?(player_name)
      $players_hash[player_name] = 1
    else
      $players_hash[player_name] = $players_hash[player_name] + 1
    end

    # CHECK IF SOMEONE WON
  end
  @channel = EM::Channel.new

  EM::WebSocket.run(:host => "localhost", :port => 8080) do |ws|
    ws.onopen { |handshake|
      puts "WebSocket connection open"

      sid = @channel.subscribe { |msg| ws.send msg }

      # Access properties on the EM::WebSocket::Handshake object, e.g.
      # path, query_string, origin, headers

      # Publish message to the client
      ws.send "Hello Client, you connected to #{handshake.path}"

      ws.onclose {
        puts "Connection closed"
        @channel.unsubscribe(sid)
      }

      ws.onmessage { |msg|
        create_or_move_player(msg)
        @channel.push({players_hash: $players_hash, length: $length}.to_json)
      }
    }


  end
}
