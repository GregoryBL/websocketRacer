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

    $players_hash.each { |player, _| $players_hash[player] = 1 } if didAnyoneWin?
  end

  def didAnyoneWin?
    $players_hash.each do |player, value|
      return true if value >= $length
    end
    return false
  end

  @channel = EM::Channel.new

  EM::WebSocket.run(:host => "192.168.2.48", :port => 8080) do |ws|
    ws.onopen { |handshake|
      puts "WebSocket connection open"

      sid = @channel.subscribe { |msg| ws.send msg }

      # Access properties on the EM::WebSocket::Handshake object, e.g.
      # path, query_string, origin, headers

      # Publish message to the client
      # ws.send "Hello Client, you connected to #{handshake.path}"

      ws.onclose {
        puts "Connection closed"
        @channel.unsubscribe(sid)
      }

      ws.onmessage { |msg|
        p msg
        create_or_move_player(msg)
        @channel.push({players_hash: $players_hash, length: $length}.to_json)
      }
    }


  end
}

