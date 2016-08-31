class Backend
  LENGTH = 30

  def initialize(app)
    @app = app
    @players_hash = {}
    @channel = []
  end

  def call(env)
    puts "Called"
    if Faye::WebSocket.websocket?(env)
      puts "is a websocket"
      ws = Faye::WebSocket.new(env, nil, {ping: 10})
      puts "websocket creation"
      ws.on :open do |event|
        puts "WebSocket connection open"
        @channel << ws
      end

      ws.on :close do |event|
        puts "Connection closed"
        @channel.delete(ws)
        ws = nil
      end

      ws.on :message do |event|
        # p event
        create_or_move_player(event.data)
        @channel.each do |client|
          client.send({players_hash: @players_hash, length: LENGTH}.to_json)
        end
      end
      ws.rack_response
    else
      @app.call(env)
    end
  end

  def create_or_move_player(player_name)
    if !@players_hash.include?(player_name)
      @players_hash[player_name] = 1
    else
      @players_hash[player_name] = @players_hash[player_name] + 1
    end

    @players_hash.each { |player, _| @players_hash[player] = 1 } if didAnyoneWin?
  end

  def didAnyoneWin?
    @players_hash.each do |player, value|
      return true if value >= LENGTH
    end
    false
  end
end