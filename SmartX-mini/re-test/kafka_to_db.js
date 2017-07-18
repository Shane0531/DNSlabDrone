const influx = require('influx')
var kafka = require('kafka-node');

// InfluxDB
var DB = new influx.InfluxDB({
    // single-host configuration
    host: 'drone',
    port: 8086, // optional, default 8086
    protocol: 'http', // optional, default 'http'
    username: 'admin',
    password: 'admin',
    database: 'labs'
});

var resourceKafka = new kafka.Client('drone:2181');
var resourceOffset = new kafka.Offset(resourceKafka);

resourceOffset.fetch([{
        topic: 'test',
        partition: 0,
        time: -1,
        maxNum: 1
    }
], function(err, data) {
    var resourceConsumer = new kafka.Consumer(resourceKafka, [{
            topic: 'test',
            partition: 0,
            offset: data['test'][0]
        }
    ], {
        autoCommit: false,
        fromOffset: true
    });

    resourceConsumer.on('message', function(message) {
        var messageJSON = JSON.parse(message.value);

        DB.writePoints([{
            measurement: 'test',
            tags: {
                ip: messageJSON.ip,
                deviceId: messageJSON.deviceId,
                timestamp: messageJSON.timestamp,
                cp: messageJSON.cp
            },
            fields: {
                memory: messageJSON.memory,
                tx: messageJSON.tx,
                rx: messageJSON.rx,
                cpu: messageJSON.cpu,
                txDropped: messageJSON.txDropped,
                rxError: messageJSON.rxError,
                disk: messageJSON.disk,
                rxDropped: messageJSON.rxDropped,
                txError: messageJSON.txError
            },
        }])

    });

});
